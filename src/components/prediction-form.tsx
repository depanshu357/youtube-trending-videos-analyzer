"use client";

import { CardContent } from "@/components/ui/card";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Sparkles } from "lucide-react";
import { PredictionResults } from "@/components/prediction-results";
import axios from "axios";

// Mock data
const categories = [
  "Current Affairs",
  "Films",
  "Gaming and Sports",
  "Music",
  "People and Lifestyle",
  "Science and Technology",
  "Travel and Vlogs",
];

const countries = [
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
];

const popularTags = [
  "trending",
  "viral",
  "music",
  "gaming",
  "tutorial",
  "vlog",
  "review",
  "reaction",
  "challenge",
  "comedy",
  "news",
  "technology",
  "sports",
  "cooking",
  "fashion",
  "beauty",
  "travel",
  "fitness",
  "education",
  "unboxing",
];

export function PredictionForm() {
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [duration, setDuration] = useState<number[]>([5]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [disLikes, setDisLikes] = useState<number>(0);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCalculate = () => {
    // setIsCalculating(true)
    // // Simulate API call delay
    // setTimeout(() => {
    //   setShowResults(true)
    //   setIsCalculating(false)
    // }, 1500)
    const data = {
      country: country,
      category: category,
      duration: duration[0] * 60,
      tags: tags.join("|"),
    };
    setIsCalculating(true);
    axios
      .post("https://171d-202-3-77-209.ngrok-free.app/predict", {
        ...data,
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then((res) => {
        // setWords(res.data);
        console.log("API response:", res.data);
        const data = res.data;
        setLikes(data.predictions["#likes"]);
        setComments(data.predictions["#comments"]);
        setViews(data.predictions["#views"]);
        setDisLikes(data.predictions["#dislikes"]);
      })
      .catch((err) => {
        console.error("Error fetching prediction data:", err);
      })
      .finally(() => {
        setIsCalculating(false);
        setShowResults(true);
      });
  };

  const handleReset = () => {
    setCategory("");
    setCountry("");
    setDuration([5]);
    setTags([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Video Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Target Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Video Duration: {duration[0]} minutes
            </label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={1}
              max={60}
              step={0.1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 min</span>
              <span>20 min</span>
              <span>40 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Video Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">
                Popular tags:
              </p>
              <div className="flex flex-wrap gap-1">
                {popularTags.slice(0, 8).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => {
                      if (!tags.includes(tag) && tags.length < 5) {
                        setTags([...tags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Selected Tags:
            </label>
            <div className="flex flex-wrap gap-1 min-h-[100px] border rounded-md p-2">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tags selected
                </p>
              ) : (
                tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      setTags((prev) => prev.filter((t) => t !== tag));
                    }}
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleReset} className="cursor-pointer">
          Reset
        </Button>
        <Button
          onClick={handleCalculate}
          disabled={!category || !country || tags.length === 0 || isCalculating}
          className="cursor-pointer"
        >
          {isCalculating ? (
            <>Calculating...</>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Calculate Prediction
            </>
          )}
        </Button>
      </div>

      {showResults && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <PredictionResults
              category={category}
              country={country}
              duration={duration[0]}
              tags={tags}
              likes={likes}
              comments={comments}
              views={views}
              dislikes={disLikes}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
