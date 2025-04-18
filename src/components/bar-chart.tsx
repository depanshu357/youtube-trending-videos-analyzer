"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import MonthYearPicker from "./month-year-picker"

// Dummy data for the bar chart
const generateBarData = (country: string) => {
  const categories = ["Entertainment", "Education", "Sports", "News", "Music", "Gaming", "Travel", "Technology"]

  return categories.map((category) => ({
    category,
    likes: Math.floor(Math.random() * 100) + 20,
    views: Math.floor(Math.random() * 1000) + 200,
    videos: Math.floor(Math.random() * 50) + 10,
  }))
}

const countries = ["USA", "China", "India", "Brazil", "UK", "Germany", "Japan", "Australia", "Canada", "France"]

const metrics = [
  { value: "likes", label: "Likes (K)" },
  { value: "views", label: "Views (K)" },
  { value: "videos", label: "Videos" },
]

export function BarChartComponent() {
  const [country, setCountry] = useState("USA")
  const [metric, setMetric] = useState("likes")

  const data = generateBarData(country)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Country</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Metric</label>
            <ToggleGroup type="single" value={metric} onValueChange={(value) => value && setMetric(value)}>
              {metrics.map((m) => (
                <ToggleGroupItem key={m.value} value={m.value}>
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Date Range</label>
            <MonthYearPicker />
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={metric}
              fill="hsl(var(--chart-1))"
              name={metrics.find((m) => m.value === metric)?.label || metric}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

