"use client"
import { useState, useEffect } from "react"
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MonthYearRangePicker from "./month-year-picker"
import dayjs from "dayjs"
import axios from "axios"

const categories = [
  "Current Affairs",
  "Films",
  "Gaming and Sports",
  "Music",
  "People and Lifestyle",
  "Science and Technology",
  "Travel and Vlogs"
]

const METRICS = [
  { value: "likes", label: "Likes" },
  { value: "views", label: "Views" },
  { value: "comments", label: "Comments" },
  { value: "dislikes", label: "Dislikes" },
]

export function LineChart() {
  const [metric, setMetric] = useState("likes")
  const [startDate, setStartDate] = useState(dayjs("2017-01"));
    const [endDate, setEndDate] = useState(dayjs("2021-12"));
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get("https://171d-202-3-77-209.ngrok-free.app/month_cat", {
          params: {
            startDate: startDate.format("YYYY-MM"),
            endDate: endDate.format("YYYY-MM"),
            metric
          },
          headers: { "ngrok-skip-browser-warning": "true" }
        })

        const monthlyData: Record<string, any> = {}

        response.data.forEach((categoryData: any) => {
          categoryData.months.forEach((monthEntry: any) => {
            const monthKey = monthEntry.month
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = {
                month: monthKey,
                date: dayjs(monthKey).format("MMM YYYY"),
                ...Object.fromEntries(categories.map(cat => [cat, 0]))
              }
            }
          })
        })

        response.data.forEach((categoryData: any) => {
          const categoryName = categoryData.category
          categoryData.months.forEach((monthEntry: any) => {
            const monthKey = monthEntry.month
            if (monthlyData[monthKey]) {
              monthlyData[monthKey][categoryName] = monthEntry.total
            }
          })
        })

        const processedData = Object.values(monthlyData).sort((a, b) => 
          dayjs(a.month).isBefore(dayjs(b.month)) ? -1 : 1
        )

        setChartData(processedData)
      } catch (err) {
        console.error("Failed to fetch chart data:", err)
        setError("Failed to load chart data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [metric, startDate, endDate])

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300",
    "#a4de6c", "#d0ed57", "#83a6ed"
  ]

  return (
    <div className="space-y-6 bg-white">

      <div className="flex flex-col sm:flex-row gap-5">
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
        <label className="text-sm font-medium mb-2 block">Select Date</label>
          <MonthYearRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <div className="h-[400px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip
                formatter={(value) => [formatNumber(value), 'Value']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
