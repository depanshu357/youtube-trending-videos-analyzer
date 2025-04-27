"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface PredictionResultsProps {
  category: string
  country: string
  duration: number
  tags: string[]
  likes: number
  comments: number
    views: number
    dislikes: number
}

// Mock prediction algorithm
const generatePredictions = (category: string, country: string, duration: number, tags: string[], views: number, likes: number, dislikes: number, comments: number) => {

  // Duration impact (optimal duration is around 8-12 minutes)
  let durationMultiplier = 1.0
  if (duration < 3) {
    durationMultiplier = 0.7
  } else if (duration >= 3 && duration < 8) {
    durationMultiplier = 0.9 + (duration - 3) * 0.05
  } else if (duration >= 8 && duration <= 15) {
    durationMultiplier = 1.2
  } else if (duration > 15 && duration <= 25) {
    durationMultiplier = 1.2 - (duration - 15) * 0.02
  } else {
    durationMultiplier = 0.8
  }


  // Calculate final predictions
  const predictions = {
    views: views,
    likes: likes,
    comments: comments,
    dislikes: dislikes,
  }

  // Calculate engagement rates
  const engagementRates = {
    likeRate: ((predictions.likes / predictions.views) * 100).toFixed(2),
    commentRate: ((predictions.comments / predictions.views) * 100).toFixed(2),
    dislikeRate: ((predictions.dislikes / predictions.views) * 100).toFixed(2),
  }

  // Calculate confidence scores (mock values)
  const confidenceScores = {
    overall: Math.min(85 + tags.length * 2, 95),
    views: Math.min(80 + tags.length * 2, 90),
    engagement: Math.min(75 + tags.length * 3, 95),
  }

  return {
    predictions,
    engagementRates,
    confidenceScores,
  }
}

// Format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function PredictionResults({ category, country, duration, tags, views, likes, comments, dislikes }: PredictionResultsProps) {
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    const predictions = generatePredictions(category, country, duration, tags, views, likes, dislikes, comments)
    setResults(predictions)
  }, [category, country, duration, tags, views, likes, dislikes, comments])

  if (!results) return null

  const { predictions, engagementRates, confidenceScores } = results

  // Prepare chart data
  const barChartData = [
    { name: "Views", value: predictions.views },
    { name: "Likes", value: predictions.likes },
    { name: "Comments", value: predictions.comments },
    { name: "Dislikes", value: predictions.dislikes },
  ]

  const pieChartData = [
    { name: "Likes", value: Number.parseFloat(engagementRates.likeRate) },
    { name: "Comments", value: Number.parseFloat(engagementRates.commentRate) },
    { name: "Dislikes", value: Number.parseFloat(engagementRates.dislikeRate) },
    {
      name: "No Engagement",
      value:
        100 -
        Number.parseFloat(engagementRates.likeRate) -
        Number.parseFloat(engagementRates.commentRate) -
        Number.parseFloat(engagementRates.dislikeRate),
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#DDDDDD"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Predicted Views"
          value={formatNumber(predictions.views)}
          confidence={confidenceScores.views}
          color="bg-blue-500"
        />
        <MetricCard
          title="Predicted Likes"
          value={formatNumber(predictions.likes)}
          confidence={confidenceScores.engagement}
          color="bg-green-500"
        />
        <MetricCard
          title="Predicted Comments"
          value={formatNumber(predictions.comments)}
          confidence={confidenceScores.engagement}
          color="bg-purple-500"
        />
        <MetricCard
          title="Predicted Dislikes"
          value={formatNumber(predictions.dislikes)}
          confidence={confidenceScores.engagement}
          color="bg-orange-500"
        />
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Metrics Charts</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="engagement" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Engagement Distribution</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Engagement Rates</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Like Rate</span>
                    <span className="text-sm font-medium">{engagementRates.likeRate}%</span>
                  </div>
                  <Progress value={Number.parseFloat(engagementRates.likeRate)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Comment Rate</span>
                    <span className="text-sm font-medium">{engagementRates.commentRate}%</span>
                  </div>
                  <Progress value={Number.parseFloat(engagementRates.commentRate)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Dislike Rate</span>
                    <span className="text-sm font-medium">{engagementRates.dislikeRate}%</span>
                  </div>
                  <Progress value={Number.parseFloat(engagementRates.dislikeRate)} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Prediction Insights</h3>
        <p className="text-sm text-muted-foreground mb-2">Based on your selected attributes, here are some insights:</p>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>
            {category} videos in {country} typically perform {predictions.views > 200000 ? "above" : "below"} average
          </li>
          <li>
            {duration} minute videos{" "}
            {duration < 8 ? "may be too short" : duration > 20 ? "may be too long" : "have optimal length"} for maximum
            engagement
          </li>
          <li>
            Your tag selection {tags.length > 5 ? "is comprehensive" : "could be improved"} for better discoverability
          </li>
          <li>
            Expected engagement rate is{" "}
            {Number.parseFloat(engagementRates.likeRate) > 8
              ? "excellent"
              : Number.parseFloat(engagementRates.likeRate) > 5
                ? "good"
                : "average"}
          </li>
        </ul>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  confidence,
  color,
}: { title: string; value: string; confidence: number; color: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <div className="mt-4">
          { /*<div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className="text-xs font-medium">{confidence}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
            <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${confidence}%` }}></div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
