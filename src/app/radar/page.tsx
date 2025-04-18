import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChartComponent } from "@/components/radar-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function RadarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Radar Analysis</h1>
          <p className="text-muted-foreground">Multi-dimensional analysis of content categories</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance Radar</CardTitle>
          <CardDescription>Compare categories across multiple metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[600px]">
          <RadarChartComponent />
        </CardContent>
      </Card>
    </div>
  )
}
