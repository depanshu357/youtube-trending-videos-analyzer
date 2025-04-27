"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PolarRadiusAxis,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MonthYearRangePicker from "./month-year-picker";
import dayjs from "dayjs";

const metrics = [
  { display: "Likes", apiKey: "likes" },
  { display: "Comments", apiKey: "comments" },
  { display: "Views", apiKey: "views" },
  { display: "Average Duration", apiKey: "avg_duration" },
  { display: "Dislikes", apiKey: "dislikes" },
];

export function RadarChartComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [metricMax, setMetricMax] = useState<Record<string, number>>({});

  const [startDate, setStartDate] = useState(dayjs("2017-01-01"));
  const [endDate, setEndDate] = useState(dayjs("2022-01-01"));

  const [categories] = useState([
    "Current Affairs",
    "Films",
    "Gaming and Sports",
    "Music",
    "People and Lifestyle",
    "Science and Technology",
    "Travel and Vlogs",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Films",
    "Music",
  ]);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8BC34A",
  ];

  function transformData(apiData: any[]) {
    const categoryMap = new Map<string, any>();
    apiData.forEach((item) => {
      categoryMap.set(item.category, item);
    });

    const newMetricMax: Record<string, number> = {};
    metrics.forEach((metric) => {
      newMetricMax[metric.apiKey] = Math.max(
        ...selectedCategories.map(
          (cat) => categoryMap.get(cat)?.[metric.apiKey] || 0
        ),
        1
      );
    });
    setMetricMax(newMetricMax);

    return metrics.map((metric) => {
      const result: any = { metric: metric.display };
      selectedCategories.forEach((category) => {
        const rawValue = categoryMap.get(category)?.[metric.apiKey] || 0;
        result[category] = rawValue / newMetricMax[metric.apiKey];
      });
      return result;
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/radar_chart",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
            params: {
              startDate: startDate.format("YYYY-MM"),
              endDate: endDate.format("YYYY-MM"),
              categories: JSON.stringify(selectedCategories),
            },
          }
        );
        setChartData(transformData(response.data));
      } catch (err) {
        setError("Failed to fetch chart data");
        setChartData([]);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCategories.length > 0) {
      fetchData();
    } else {
      setChartData([]);
    }
  }, [startDate, endDate, selectedCategories]);

  const allSelected = selectedCategories.length === categories.length;
  const partiallySelected = selectedCategories.length > 0 && !allSelected;

  const toggleCategory = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow text-xs">
          <div className="font-bold mb-1">{label}</div>
          {payload.map((entry: any, idx: number) => {
            const metricObj = metrics.find((m) => m.display === label);
            const apiKey = metricObj ? metricObj.apiKey : "";
            const origValue = metricMax[apiKey]
              ? Math.round(entry.value * metricMax[apiKey])
              : entry.value;
            return (
              <div key={entry.dataKey} style={{ color: entry.color }}>
                {entry.dataKey}: <b>{origValue.toLocaleString()}</b>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold"></h2>
        <MonthYearRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      <div>
        {/* <label className="text-sm font-medium mb-2 block">Select Categories to Compare</label> */}
        <div className="flex items-center space-x-2 mb-4 px-4 cursor-pointer">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onChange={(e) => toggleAll(e.target.checked)}
            aria-checked={partiallySelected ? "mixed" : allSelected}
          />
          <Label htmlFor="select-all">Select All</Label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2">
          {categories.map((category, index) => (
            <div
              key={category}
              className="flex items-center p-2 bg-muted rounded-lg hover:bg-accent transition-colors space-x-3"
            >
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onChange={(e) => toggleCategory(category, e.target.checked)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="flex items-center text-sm font-medium cursor-pointer space-x-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span>{category}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[400px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <p className="text-red-500">{error}</p>
          </div>
        ) : selectedCategories.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center p-4 rounded-md shadow-sm bg-background">
              <p className="text-lg font-medium">No data to display</p>
              <p className="text-sm text-muted-foreground">
                Please select at least one category to view the chart
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="80%">
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 1.2]} />
              <Tooltip content={CustomTooltip} />
              {selectedCategories.map((category) => {
                const index = categories.indexOf(category);
                const color = colors[index % colors.length];
                return (
                  <Radar
                    key={category}
                    name={category}
                    dataKey={category}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.2}
                  />
                );
              })}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
