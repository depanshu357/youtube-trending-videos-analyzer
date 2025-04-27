"use client";

import { useEffect, useState } from "react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import dayjs from "dayjs";
import MonthYearRangePicker from "./month-year-picker";

const categories = [
  "ALL",
  "Current Affairs",
  "Films",
  "Gaming and Sports",
  "Music",
  "People and Lifestyle",
  "Science and Technology",
  "Travel and Vlogs",
];

export function CorrelationMatrix() {
  const [category, setCategory] = useState("ALL");
  const [matrix, setMatrix] = useState<any[]>([]);
  const [rawData, setRawData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs("2016-01-01"));
  const [countries] = useState([
    { code: "BR", name: "Brazil" },
    { code: "CA", name: "Canada" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "MX", name: "Mexico" },
    { code: "RU", name: "Russia" },
    { code: "US", name: "United States" },
  ]);
  const [selectedCountry, setSelectedCountry] = useState("US");
  // Set default endDate to January 1, 2022
  const [endDate, setEndDate] = useState(dayjs("2022-01-01"));
  const metrics = ["likes", "views", "duration", "dislikes", "comments"];

  const populateMatrix = (data: any) => {
    const arr: any[] = [];

    // Generate a symmetric correlation arr with values between -1 and 1
    for (let i = 0; i < metrics.length; i++) {
      const row: any = { metric: metrics[i] };

      for (let j = 0; j < metrics.length; j++) {
        if (i === j) {
          row[metrics[j]] = 1; // Perfect correlation with self
        } else if (arr[j] && arr[j][metrics[i]] !== undefined) {
          row[metrics[j]] = arr[j][metrics[i]]; // Symmetric arr
        } else {
          const key = metrics[i] + "_" + metrics[j];
          const reverseKey = metrics[j] + "_" + metrics[i];
          row[metrics[j]] =
            key in data ? data[key] : reverseKey in data ? data[reverseKey] : 0; // Use the data from the API or default to 0
        }
      }

      arr.push(row);
    }

    setMatrix(arr);
  };

  function fetchData() {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/corr_mat", {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
        params: {
          //   country: countryCodeMap[country], // send code, not name
          startDate: startDate.format("YYYY-MM"),
          endDate: endDate.format("YYYY-MM"),
          category: category,
          country: selectedCountry,
        },
      })
      .then((response) => {
        console.log("Correlation matrix data:", response.data);
        const list = response.data;
        for (let i = 0; i < list.length; i++) {
          if (list[i].category === category) {
            setRawData(list[i]);
            console.log("Raw data:", list[i]);
            populateMatrix(list[i]); // Populate the matrix with the data
            break;
          }
        }

        // Handle the response data here
      })
      .catch((error) => {
        console.error("Error fetching correlation matrix data:", error);
      });
  }

  useEffect(() => {
    fetchData();
    console.log(
      `Fetching data for category: ${category}, startDate: ${startDate.format(
        "YYYY-MM"
      )}, endDate: ${endDate.format("YYYY-MM")}`
    );
  }, [category, startDate, endDate, selectedCountry]);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to get color based on correlation value
  const getColor = (value: number) => {
    if (typeof window === "undefined") return "hsl( 0, 0, 0)"; // Avoid mismatch during SSR
    // Red for negative, blue for positive
    const hue = value < 0 ? 0 : 210;
    const saturation = Math.abs(value) * 100;
    const lightness = 100 - Math.abs(value) * 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex flex-row gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Country</label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Date-Range</label>
          <MonthYearRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[auto_repeat(5,1fr)]">
            {/* Header row with metrics */}
            <div className="p-2"></div>
            {metrics.map((metric) => (
              <div
                key={metric}
                className="p-2 text-xs font-medium text-center capitalize"
              >
                {metric}
              </div>
            ))}

            {/* Data rows */}
            {matrix.length === 0 ? (
              <div>Loading...</div>
            ) : (
              matrix.map((row: any, i) => (
                <React.Fragment key={row.metric}>
                  <div className="p-2 text-xs font-medium capitalize">
                    {row.metric}
                  </div>
                  {metrics.map((metric) => {
                    const value = row[metric];
                    return (
                      <div
                        key={`${row.metric}-${metric}`}
                        style={{ backgroundColor: getColor(value) }}
                        className="p-2 text-xs text-center"
                        title={`${row.metric} vs ${metric}: ${value.toFixed(
                          2
                        )}`}
                      >
                        {value.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">-1.0 (Negative)</div>
        <div className="h-2 w-full max-w-[200px] mx-2 bg-gradient-to-r from-[hsl(0,100%,75%)] via-[hsl(0,0%,95%)] to-[hsl(210,100%,75%)]"></div>
        <div className="text-xs text-muted-foreground">+1.0 (Positive)</div>
      </div>
    </div>
  );
}
