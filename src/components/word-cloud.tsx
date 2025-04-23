"use client";

import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import WordCloud from "react-d3-cloud";
import axios from "axios";
import MonthYearPicker from "./month-year-picker";
import dayjs from "dayjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Word {
  text: string;
  value: number;
}

type Props = {};

const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 150;

export const WordCloudComponent = forwardRef<HTMLDivElement, Props>(({ }, ref) => {
  const [countries] = useState([
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'MX', name: 'Mexico' },
    { code: 'RU', name: 'Russia' },
    { code: 'US', name: 'United States' },
  ]);
  const [categories] = useState<string[]>([
    'Gaming and Sports',
    'Films',
    'People and Lifestyle',
    'Travel and Vlogs',
    'Music',
    'Science and Technology',
    'Current Affairs'
  ]);

  const [words, setWords] = useState<Word[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("CA");
  const [selectedCategory, setSelectedCategory] = useState("Films");
  const [startDate, setStartDate] = useState(dayjs("2017-01"));
  const [endDate, setEndDate] = useState(dayjs("2021-12"));
  const [loading, setLoading] = useState(true);

  const sortedWords = useMemo(
    () => words.sort((a, b) => b.value - a.value).slice(0, MAX_WORDS),
    [words]
  );

  const [minOccurences, maxOccurences] = useMemo(() => {
    const values = sortedWords.map((w) => w.value);
    return [Math.min(...values), Math.max(...values)];
  }, [sortedWords]);

  const calculateFontSize = useCallback(
    (value: number) => {
      if (minOccurences === maxOccurences) {
        return (MAX_FONT_SIZE + MIN_FONT_SIZE) / 2;
      }
      const normalized = (value - minOccurences) / (maxOccurences - minOccurences);
      return Math.round(MIN_FONT_SIZE + normalized * (MAX_FONT_SIZE - MIN_FONT_SIZE));
    },
    [minOccurences, maxOccurences]
  );

  const calculateFontWeight = useCallback(
    (value: number) => {
      const normalized = (value - minOccurences) / (maxOccurences - minOccurences || 1);
      return Math.round(MIN_FONT_WEIGHT + normalized * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT));
    },
    [minOccurences, maxOccurences]
  );

  useEffect(() => {
    setLoading(true);
    const params = {
      country: selectedCountry,
      category: selectedCategory,
      startDate: startDate.format("YYYY-MM"),
      endDate: endDate.format("YYYY-MM"),
    };
    console.log("Sending parameters to backend:", params);
    axios
      .get("https://171d-202-3-77-209.ngrok-free.app/word_cloud", {
        params,
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then((res) => {
        setWords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching word cloud data:", err);
        setLoading(false);
      });
  }, [selectedCountry, selectedCategory, startDate, endDate]);

  return (
    <div ref={ref} style={{ width: "900px", height: "500px" }}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Date Range</label>
          <MonthYearPicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sortedWords.length > 0 ? (
        <WordCloud
          width={1800}
          height={1000}
          font="Poppins"
          fontWeight={(word) => calculateFontWeight(word.value)}
          fontSize={(word) => calculateFontSize(word.value)}
          rotate={0}
          padding={1}
          data={sortedWords}
          random={() => 0.5}
        />
      ) : (
        <p>No tags found for the selected filters.</p>
      )}
    </div>
  );
});

WordCloudComponent.displayName = "WordCloud";