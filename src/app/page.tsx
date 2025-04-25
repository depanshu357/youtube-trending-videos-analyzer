"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/line-chart"
import { HeatMap } from "@/components/heat-map"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"
import WorldMap from "@/components/world-map"
import { useEffect, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState<{
    likes: number
    views: number
    comments: number
    likesChange: number | null
    viewsChange: number | null
    commentsChange: number | null
  }>({
    likes: 0,
    views: 0,
    comments: 0,
    likesChange: null,
    viewsChange: null,
    commentsChange: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMonth = dayjs("2021-12")
        const previousMonth = dayjs("2021-12").subtract(1, 'month')
  
        const [currentRes, previousRes] = await Promise.all([
          axios.get("https://171d-202-3-77-209.ngrok-free.app/month_specific", {
            params: { month: currentMonth.format("YYYY-MM") },
            headers: { "ngrok-skip-browser-warning": "true" }
          }),
          axios.get("https://171d-202-3-77-209.ngrok-free.app/month_specific", {
            params: { month: previousMonth.format("YYYY-MM") },
            headers: { "ngrok-skip-browser-warning": "true" }
          })
        ])
  
        const calcChange = (current: number, previous: number) => 
          previous === 0 ? null : ((current - previous) / previous) * 100
  
        setMetricsData({
          likes: currentRes.data.totals.likes,
          views: currentRes.data.totals.views,
          comments: currentRes.data.totals.comments,
          likesChange: calcChange(currentRes.data.totals.likes, previousRes.data.totals.likes),
          viewsChange: calcChange(currentRes.data.totals.views, previousRes.data.totals.views),
          commentsChange: calcChange(currentRes.data.totals.comments, previousRes.data.totals.comments)
        })
      } catch (err) {
        console.error("Failed to fetch metrics:", err)
      }
    }
  
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Trending Analysis</h1>
          <p className="text-muted-foreground">Interactive data visualizations for YouTube trending videos</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {new Intl.NumberFormat('en-US', {
          notation: "compact",
          maximumFractionDigits: 1
        }).format(metricsData.views)}
      </div>
      <p className="text-xs text-muted-foreground">
        {metricsData.viewsChange ? 
          `${metricsData.viewsChange >= 0 ? '+' : ''}${metricsData.viewsChange.toFixed(1)}% from last month` : 
          'No previous data'}
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {new Intl.NumberFormat('en-US', {
          notation: "compact",
          maximumFractionDigits: 1
        }).format(metricsData.likes)}
      </div>
      <p className="text-xs text-muted-foreground">
        {metricsData.likesChange ? 
          `${metricsData.likesChange >= 0 ? '+' : ''}${metricsData.likesChange.toFixed(1)}% from last month` : 
          'No previous data'}
      </p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {new Intl.NumberFormat('en-US', {
          notation: "compact",
          maximumFractionDigits: 1
        }).format(metricsData.comments)}
      </div>
      <p className="text-xs text-muted-foreground">
        {metricsData.commentsChange ? 
          `${metricsData.commentsChange >= 0 ? '+' : ''}${metricsData.commentsChange.toFixed(1)}% from last month` : 
          'No previous data'}
      </p>
    </CardContent>
  </Card>
</div>


      <Tabs defaultValue="line" className="space-y-4">
        <TabsList>
          <TabsTrigger value="line">Trending Over Time</TabsTrigger>
          <TabsTrigger value="heat">Country Heat Map</TabsTrigger>
          <TabsTrigger value="globe">Global Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Trends Over Time</CardTitle>
              <CardDescription>Track how different YouTube categories trend over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[550px]">
              <LineChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance by Country</CardTitle>
              <CardDescription>
                Heat map showing how YouTube categories perform across different countries
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[700px]">
              {<HeatMap />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="globe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Category Rankings</CardTitle>
              <CardDescription>Hover on countries to see top performing YouTube categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[550px]">
              {<WorldMap />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Explore More Visualizations</CardTitle>
            <CardDescription>Check out our detailed YouTube trending analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link href="/bar-chart">
                <Button variant="outline" className="w-full justify-start">
                  Country-specific Trending Videos
                </Button>
              </Link>
              <Link href="/correlation">
                <Button variant="outline" className="w-full justify-start">
                  Engagement Correlation Matrix
                </Button>
              </Link>
              <Link href="/radar">
                <Button variant="outline" className="w-full justify-start">
                  Category Performance Radar
                </Button>
              </Link>
              <Link href="/word-cloud">
                <Button variant="outline" className="w-full justify-start">
                  Video Title Word Clouds
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>Key findings from YouTube trending data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Music Video Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Music videos have seen a 45% increase in engagement over the last quarter.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Regional Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Educational content trends in North America and Europe, while entertainment dominates in Asia.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Engagement Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Videos between 8-12 minutes show the highest like-to-view ratio across all categories.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

