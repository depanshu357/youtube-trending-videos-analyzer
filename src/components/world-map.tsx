"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import axios from "axios";
import MonthYearRangePicker from "./month-year-picker";
import dayjs from "dayjs";

const GEOJSON_URL =
  "https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/natural-earth-countries-1_110m@public/exports/geojson?lang=en&timezone=Europe%2FBerlin";

const METRICS = [
  { value: "likes", label: "Likes" },
  { value: "views", label: "Views" },
  { value: "comments", label: "Comments" },
  { value: "dislikes", label: "Dislikes" },
];

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [metric, setMetric] = useState("likes");
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [backendData, setBackendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(dayjs("2021-01"));
  const [endDate, setEndDate] = useState(dayjs("2021-12"));

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [geojson, backend] = await Promise.all([
          d3.json(GEOJSON_URL),
          axios.get("https://171d-202-3-77-209.ngrok-free.app/world_map", {
            params: {
              startDate: startDate.format("YYYY-MM"),
              endDate: endDate.format("YYYY-MM"),
              metric,
            },
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
        ]);
        setGeojsonData(geojson);
        setBackendData(backend.data);
      } catch (err) {
        setError("Failed to load map data");
        console.error("Error loading data:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [metric, startDate, endDate]);

  useEffect(() => {
    if (!geojsonData || !backendData.length) return;

    const dataByCountry: Record<string, { total: number; topCategories: [string, number][] }> = {};
    backendData.forEach((row: any) => {
      const country = row.country;
      if (!country) return;
      let total = 0;
      let categories: [string, number][] = [];
      for (let key in row) {
        if (key !== "country") {
          total += parseFloat(row[key]) || 0;
          categories.push([key, parseFloat(row[key]) || 0]);
        }
      }
      categories.sort((a, b) => b[1] - a[1]);
      dataByCountry[country] = {
        total,
        topCategories: categories.slice(0, 5),
      };
    });

    geojsonData.features.forEach((d: any) => {
      const countryCode = d.properties.iso_a2;
      if (dataByCountry[countryCode]) {
        d.properties.metric = dataByCountry[countryCode].total;
        d.properties.topCategories = dataByCountry[countryCode].topCategories;
      } else {
        d.properties.metric = 0;
        d.properties.topCategories = [];
      }
    });

    function pastelize(interpolator, amount = 0.5) {
      return t => {
        const c = d3.hsl(interpolator(t));
        // Increase lightness (l): 0 = black, 1 = white
        // You can tweak amount (0.2-0.5) for more/less pastel
        c.l = c.l + amount * (1 - c.l);
        c.s = c.s * 0.7; // Optionally reduce saturation for softer look
        return c.toString();
      };
    }

    const width = 1000;
    const height = 400;
    const legendWidth = 100;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px")
      .style("border-radius", "6px")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.15)")
      .style("font-size", "12px")
      .style("display", "none");

    // Create color scale
    const domain = d3.extent(geojsonData.features, (d: any) => d.properties.metric);
    const colorScale = d3.scaleSequential(pastelize(d3.interpolateCool, 0.35)).domain(domain);

    // Create projection and path
    const projection = d3.geoEquirectangular().fitSize([width, height], geojsonData as any);
    const path = d3.geoPath().projection(projection);

    // Draw countries
    svg
      .selectAll("path")
      .data(geojsonData.features)
      .join("path")
      .attr("d", path as any)
      .attr("class", "country")
      .attr("stroke", "lightblue")
      .attr("stroke-width", 0.75)
      .attr("fill", (d: any) => colorScale(d.properties.metric))
      .on("mouseover", function (event, d: any) {
        d3.select(this).attr("stroke", "#666").attr("stroke-width", 2);
        tooltip.style("display", "block")
          .html(`
            <div class="font-bold mb-1">${d.properties.name}</div>
            <div>${metric}: <b>${d.properties.metric.toLocaleString()}</b></div>
            <div class="mt-1">Top 5 Categories:</div>
            <div>${d.properties.topCategories.map(cat => `${cat[0]} (${cat[1].toLocaleString()})`).join("<br/>")}</div>
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "lightblue").attr("stroke-width", 0.75);
        tooltip.style("display", "none");
      });

    // Create legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 50}, 20)`);

    // Create gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

      gradient.selectAll("stop")
      .data(d3.range(0, 1.01, 0.1))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => pastelize(d3.interpolateCool, 0.35)(d));

    // Add gradient rect
    legend.append("rect")
      .attr("width", 20)
      .attr("height", 360)
      .style("fill", "url(#legend-gradient)");

    // Add legend axis
    const legendScale = d3.scaleLinear()
      .domain(domain)
      .range([360, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".2s"));

    legend.append("g")
      .attr("transform", "translate(20,0)")
      .call(legendAxis);

    return () => {
      tooltip.remove();
    };
  }, [geojsonData, backendData, metric]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Global Video Metrics</h2>
        <MonthYearRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Metric</label>
          <ToggleGroup type="single" value={metric} onValueChange={(value) => value && setMetric(value)}>
            {METRICS.map((m) => (
              <div key={m.value}>
              <ToggleGroupItem key={m.value} value={m.value}>
                {m.label}
              </ToggleGroupItem>
              </div>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="relative h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Loading map data...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <svg 
            ref={svgRef} 
            width="1200" 
            height="500" 
            viewBox="0 0 1200 500"
          />
        )}
      </div>
    </div>
  );
}
