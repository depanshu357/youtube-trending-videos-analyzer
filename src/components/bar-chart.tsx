"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const countries = ["USA", "China", "India", "Brazil", "UK", "Germany", "Japan", "Australia", "Canada", "France"]

const metrics = [
  { value: "likes", label: "Likes (K)" },
  { value: "views", label: "Views (K)" },
  { value: "videos", label: "Videos" },
]

export function BarChartComponent() {
  const [country, setCountry] = useState("USA")
  const [metric, setMetric] = useState("likes")
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/bar-data?country=${country}`)
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setData([]) // fallback to empty array on error
      }
    }

    fetchData()
  }, [country])

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
