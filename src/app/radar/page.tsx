'use client'

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChartComponent } from "@/components/radar-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toPng } from "html-to-image"

export default function RadarPage() {
  const radarRef = useRef(null);

  const handleExport = async () => {
    if (radarRef.current === null) return;

    try {
      const dataUrl = await toPng(radarRef.current);
      const link = document.createElement('a');
      link.download = 'radar-chart.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export radar chart', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Radar Analysis</h1>
          <p className="text-muted-foreground">Multi-dimensional analysis of content categories</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance Radar</CardTitle>
          <CardDescription>Compare categories across multiple metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[700px]">
          <div ref={radarRef}>
            <RadarChartComponent />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
