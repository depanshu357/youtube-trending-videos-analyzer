"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import axios from "axios";
import MonthYearRangePicker from "./month-year-picker";
import dayjs from "dayjs";
import { useRouter } from 'next/navigation';

// --- Custom hook to observe container size ---
function useContainerSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 1200, height: 400 }); // default aspect

  useEffect(() => {
    if (!ref.current) return;
    const handleResize = () => {
      const rect = ref.current.getBoundingClientRect();
      // Maintain a 3:1 aspect ratio, but you can change as needed
      const width = rect.width;
      const height = Math.max(rect.height, width / 3); // fallback if height is 0
      setSize({ width, height });
    };
    handleResize();
    const observer = new window.ResizeObserver(handleResize);
    observer.observe(ref.current);
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return [ref, size];
}

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
  const [containerRef, { width, height }] = useContainerSize();
  const [metric, setMetric] = useState("likes");
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [backendData, setBackendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(dayjs("2021-01"));
  const [endDate, setEndDate] = useState(dayjs("2021-12"));
  const router = useRouter();

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
    if (!geojsonData || !backendData.length || !width || !height) return;

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

    function formatNumber(num) {
      if (num == null) return '';
      if (Math.abs(num) < 1000) return num.toString();
      const units = ["K", "M", "B", "T", "P", "E"];
      let unit = -1;
      let value = num;
      while (Math.abs(value) >= 1000 && unit < units.length - 1) {
        value /= 1000;
        unit++;
      }
      return value.toFixed(1).replace(/\.00$/, '') + units[unit];
    }

    function pastelize(interpolator, amount = 0.5) {
      return t => {
        const c = d3.hsl(interpolator(t));
        c.l = c.l + amount * (1 - c.l);
        c.s = c.s * 0.7;
        return c.toString();
      };
    }

    
    // --- Use adaptive width & height for projection and viewBox ---
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
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
    
    const domain = d3.extent(geojsonData.features, (d: any) => d.properties.metric);
    const [min, max] = domain;
    const colorScale = d3.scaleSequential(pastelize(d3.interpolateCool, 0.35)).domain([min, max]);
    
    const legendWidth = 100;
    const mapWidth = width - legendWidth - 40;
    const projection = d3.geoEquirectangular().fitSize([mapWidth, height], geojsonData as any);    
    const path = d3.geoPath().projection(projection);

    function getMetricLabel(metric) {
      const found = METRICS.find(m => m.value === metric);
      return found ? found.label : metric;
    }

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
          <div>${getMetricLabel(metric)}: <b>${formatNumber(d.properties.metric)}</b></div>
          <div class="mt-1">Top 5 Categories:</div>
          <div>${d.properties.topCategories.map(cat => `${cat[0]} (${formatNumber(cat[1])})`).join("<br/>")}</div>
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
      })
      .on("click", function(event, d: any) {
        const countryCode = d.properties.iso_a2;
        const countryName = inverseCountryCodeMap[countryCode];

        if (countryName) {
          router.push(
            `/bar-chart?country=${encodeURIComponent(countryName)}` +
            `&metric=${metric}` +
            `&startDate=${startDate.format("YYYY-MM")}` +
            `&endDate=${endDate.format("YYYY-MM")}`
          );
        }
      });

      const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${mapWidth + 30}, 20)`);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

    gradient.selectAll("stop")
      .data(d3.range(0, 1.01, 0.1))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => pastelize(d3.interpolateCool, 0.35)(1 - d));

    legend.append("rect")
      .attr("width", 20)
      .attr("height", height - 40)
      .style("fill", "url(#legend-gradient)");

    const legendScale = d3.scaleLinear()
      .domain(domain)
      .range([height - 40, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".2s"));

    legend.append("g")
      .attr("transform", "translate(20,0)")
      .call(legendAxis);

    return () => {
      tooltip.remove();
    };
  }, [geojsonData, backendData, metric, width, height]);

  const inverseCountryCodeMap = {
    "BR": "Brazil",
    "CA": "Canada",
    "DE": "Germany",
    "FR": "France",
    "GB": "Great Britain (UK)",
    "IN": "India",
    "JP": "Japan",
    "KR": "South Korea",
    "MX": "Mexico",
    "RU": "Russia",
    "US": "USA"
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex flex-col sm:flex-row gap-4">
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
        <div>
          <label className="text-sm font-medium mb-2 block">Select Date-Range</label>
          <MonthYearRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <div ref={containerRef} className="relative w-full min-h-[200px] max-h-[450px] aspect-[3/1] overflow-hidden">
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
            className="w-full h-full"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </div>
    </div>
  );
}
