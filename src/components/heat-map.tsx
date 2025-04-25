"use client"

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Download } from "lucide-react"
import axios from "axios"
import dayjs from "dayjs"
import MonthYearRangePicker from "./month-year-picker"

// Define categories and countries
const CATEGORIES = [
  "Current Affairs",
  "Films",
  "Gaming and Sports",
  "Music",
  "People and Lifestyle",
  "Science and Technology",
  "Travel and Vlogs"
]

const COUNTRIES = ['BR', 'CA', 'DE', 'FR', 'GB', 'IN', 'JP', 'KR', 'MX', 'RU', 'US']

const COUNTRY_NAMES: Record<string, string> = {
  'BR': 'Brazil',
  'CA': 'Canada',
  'DE': 'Germany',
  'FR': 'France',
  'GB': 'United Kingdom',
  'IN': 'India',
  'JP': 'Japan',
  'KR': 'South Korea',
  'MX': 'Mexico',
  'RU': 'Russia',
  'US': 'United States'
}

const METRICS = [
  { value: "likes", label: "Likes" },
  { value: "views", label: "Views" },
  { value: "comments", label: "Comments" },
  { value: "dislikes", label: "Dislikes" }
]

type HeatMapDataItem = {
  country: string;
  [category: string]: number | string;
}

export function HeatMap() {
  const [metric, setMetric] = useState("likes")
  const [heatMapData, setHeatMapData] = useState<HeatMapDataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [startDate, setStartDate] = useState(dayjs("2021-01"))
  const [endDate, setEndDate] = useState(dayjs("2021-12"))

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError("")
      try {
        const response = await axios.get("https://171d-202-3-77-209.ngrok-free.app/world_map", {
          params: {
            startDate: startDate.format("YYYY-MM"),
            endDate: endDate.format("YYYY-MM"),
            metric: metric
          },
          headers: { 
            "ngrok-skip-browser-warning": "true"
          }
        })
        setHeatMapData(response.data)
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [metric, startDate, endDate])

  // Find min and max values for the selected metric across all categories
  const getAllValues = () => {
    const values: number[] = []
    
    heatMapData.forEach(countryData => {
      CATEGORIES.forEach(category => {
        if (typeof countryData[category] === 'number') {
          values.push(countryData[category] as number)
        }
      })
    })
    
    return values
  }

  const values = getAllValues()
  const minValue = values.length ? Math.min(...values) : 0
  const maxValue = values.length ? Math.max(...values) : 1

// Helper to interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

// Convert RGB array to CSS string
function rgbToString(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Main color function: red (low) -> white (mid) -> blue (high)
const getColor = (value) => {
  if (isNaN(value) || value === undefined) return "rgb(240,240,240)";

  const normalizedValue = (value - minValue) / (maxValue - minValue) || 0.0;

  // Define muted red, white, and muted blue
  const red = [200, 80, 80];    // Muted red
  const white = [245, 245, 245]; // Muted white
  const blue = [80, 120, 200];   // Muted blue

  if (normalizedValue < 0.5) {
    // Red to white
    const t = normalizedValue / 0.5;
    return rgbToString(interpolateColor(red, white, t));
  } else {
    // White to blue
    const t = (normalizedValue - 0.5) / 0.5;
    return rgbToString(interpolateColor(white, blue, t));
  }
};



  const formatValue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    } else {
      return value.toString()
    }
  }

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

      <div className="overflow-x-auto relative w-full min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Loading data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40 bg-red-50 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[auto_repeat(7,1fr)]">
              <div className="p-2 font-semibold"></div>
              {CATEGORIES.map((category) => (
                <div key={category} className="p-2 text-xs font-medium text-center">
                  {category}
                </div>
              ))}

              {COUNTRIES.map((countryCode) => {
                const countryData = heatMapData.find((d) => d.country === countryCode) || {}
                return (
                  <React.Fragment key={countryCode}>
                    <div className="p-2 text-xs font-medium whitespace-nowrap">
                      {COUNTRY_NAMES[countryCode] || countryCode}
                    </div>
                    {CATEGORIES.map((category) => {
                      const value = countryData[category] as number || 0
                      return (
                        <div
                          key={`${countryCode}-${category}`}
                          className="p-3 text-xs text-center transition-colors"
                          style={{ backgroundColor: getColor(value) }}
                          title={`${COUNTRY_NAMES[countryCode] || countryCode}, ${category}: ${value.toLocaleString()}`}
                        >
                          {formatValue(value)}
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex items-center justify-center">
        <div className="text-xs text-muted-foreground">Low</div>
        <div
          className="h-2 w-full max-w-[200px] mx-2"
          style={{
            background: "linear-gradient(to right, rgb(200,80,80), rgb(245,245,245), rgb(80,120,200))"
          }}
        ></div>
        <div className="text-xs text-muted-foreground">High</div>
      </div>
      
      )}


    </div>
  )
}
