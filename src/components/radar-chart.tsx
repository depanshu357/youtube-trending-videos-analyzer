"use client"

import { useState, useEffect } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Month and year configuration
const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
]

const generateRadarData = (startDate: Date, endDate: Date) => {
  // ... existing data generation logic ... 
}

export function RadarChartComponent() {
  const [startMonth, setStartMonth] = useState<number>(new Date().getMonth())
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear() - 1)
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth())
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear())
  const [chartData, setChartData] = useState<{ categories: string[]; data: any[] }>({
    categories: [],
    data: [],
  })

  // ... existing state and effects ...

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Category Performance Radar</h2>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="start-month">Start Period</Label>
            <div className="flex gap-2">
              <Select
                value={startMonth.toString()}
                onValueChange={(value) => setStartMonth(parseInt(value))}
                aria-label="Select start month"
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={startYear.toString()}
                onValueChange={(value) => setStartYear(parseInt(value))}
                aria-label="Select start year"
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="end-month">End Period</Label>
            <div className="flex gap-2">
              <Select
                value={endMonth.toString()}
                onValueChange={(value) => setEndMonth(parseInt(value))}
                aria-label="Select end month"
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={endYear.toString()}
                onValueChange={(value) => setEndYear(parseInt(value))}
                aria-label="Select end year"
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  )
}
