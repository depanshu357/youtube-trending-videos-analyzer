import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import WorldMap from "@/components/world-map"

export default function WorldMapPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">World Map</h1>
          <p className="text-muted-foreground">Global distribution of video metrics by country</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Video Metrics Map</CardTitle>
          <CardDescription>
            Visualize and compare content metrics across countries and time periods
          </CardDescription>
        </CardHeader>
        <CardContent className="h-auto">
          <WorldMap />
        </CardContent>
      </Card>
    </div>
  )
}
