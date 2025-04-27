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
import MonthYearPicker from "./month-year-picker"
import dayjs from "dayjs"
import { useSearchParams } from 'next/navigation'

// Country names for the dropdown
const countries = [
  "Brazil",
  "Canada",
  "Germany",
  "France",
  "Great Britain (UK)",
  "India",
  "Japan",
  "South Korea",
  "Mexico",
  "Russia",
  "USA"
]

// Mapping country names to their codes
const countryCodeMap = {
  "Brazil": "BR",
  "Canada": "CA",
  "Germany": "DE",
  "France": "FR",
  "Great Britain (UK)": "GB",
  "India": "IN",
  "Japan": "JP",
  "South Korea": "KR",
  "Mexico": "MX",
  "Russia": "RU",
  "USA": "US",
}

const metrics = [
  { value: "likes", label: "Likes (M)" },
  { value: "views", label: "Views (M)" },
  { value: "videos", label: "Videos" },
  { value: "comments", label: "Comments (M)" },
  { value: "dislikes", label: "Dislikes (M)" },
]

export function BarChartComponent() {
  const [country, setCountry] = useState("USA")
  const [metric, setMetric] = useState("likes")
  const [startDate, setStartDate] = useState(dayjs('2017-01-01'))
  const [endDate, setEndDate] = useState(dayjs('2022-01-01'))
  const [data, setData] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()

  // Parse search params once on mount
  useEffect(() => {
    const urlCountry = searchParams.get('country')
    const urlMetric = searchParams.get('metric')
    const urlStart = searchParams.get('startDate')
    const urlEnd = searchParams.get('endDate')

    if (urlCountry && countries.includes(urlCountry)) setCountry(urlCountry)
    if (urlMetric && metrics.some(m => m.value === urlMetric)) setMetric(urlMetric)
    if (urlStart) setStartDate(dayjs(urlStart))
    if (urlEnd) setEndDate(dayjs(urlEnd))

    setIsReady(true)
  }, [searchParams])

  useEffect(() => {
    if (!isReady) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('https://171d-202-3-77-209.ngrok-free.app/bar_chart', {
          headers: { 'ngrok-skip-browser-warning': true },
          params: {
            country: countryCodeMap[country],
            startDate: startDate.format("YYYY-MM"),
            endDate: endDate.format("YYYY-MM"),
          },
        })
        setData(response.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [country, startDate, endDate, isReady])

  return (
    <div className="space-y-6 bg-white">
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
            <ToggleGroup
              type="single"
              value={metric}
              onValueChange={(value) => value && setMetric(value)}
              className="flex flex-wrap gap-2 mt-1"
            >
              {metrics.map((m) => (
                <ToggleGroupItem key={m.value} value={m.value}>
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Date-Range</label>
            <MonthYearPicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value.length > 10 ? value.slice(0, 10) + "…" : value
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={metric}
                fill="#8884d8"
                name={metrics.find((m) => m.value === metric)?.label || metric}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
