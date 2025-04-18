"use client";

import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import WordCloud from "react-d3-cloud";
import axios from "axios";

interface Word {
  text: string;
  value: number;
}

interface RawEntry {
  country: string;
  category: string;
  tags: string;
}

type Props = {};

const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 150;
const MIN_OCCURRENCE = 3;

export const WordCloudComponent = forwardRef<HTMLDivElement, Props>(({ }, ref) => {
  const [countries] = useState<string[]>(['BR', 'CA', 'DE', 'FR', 'GB', 'IN', 'JP', 'KR', 'MX', 'RU', 'US']);
  const [categories] = useState<string[]>([
    'Gaming and sports',
    'Films',
    'People and lifestyle',
    'Travel and vlogs',
    'Music',
    'Science and Technology',
    'Current affairs'
  ]);

  const [rawData, setRawData] = useState<RawEntry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("CA");
  const [selectedCategory, setSelectedCategory] = useState("Films");
  const [words, setWords] = useState<Word[]>([]);

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
      // All values are the same, return a large base font size
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

  const processData = useCallback(
    (data: RawEntry[]) => {
      const filtered = data.filter(
        (entry) =>
          entry.country === selectedCountry && entry.category === selectedCategory
      );

      const tagCounts: Record<string, number> = {};
      filtered.forEach((entry) => {
        const tags = entry.tags.split("|").map((tag) => tag.trim().toLowerCase());
        tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const wordData: Word[] = Object.entries(tagCounts)
        .filter(([_, count]) => count >= MIN_OCCURRENCE)
        .map(([text, value]) => ({ text, value }));

      return wordData;
    },
    [selectedCountry, selectedCategory]
  );

  useEffect(() => {
    axios
      .get("https://171d-202-3-77-209.ngrok-free.app/word_cloud", {
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then((res) => {
        setRawData(res.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Process data whenever the selectedCountry/category or rawData changes
  useEffect(() => {
    if (rawData.length > 0) {
      setWords(processData(rawData));
    }
  }, [rawData, selectedCountry, selectedCategory, processData]);

  return (
    <div ref={ref} style={{ width: "900px", height: "500px" }}>
      <div className="flex gap-4 mb-4">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border p-2 rounded"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {sortedWords.length > 0 ? (
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
