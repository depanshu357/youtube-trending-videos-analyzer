"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeatMap } from "@/components/heat-map"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRef } from "react";
import { toPng, toJpeg } from "html-to-image"

export default function HeatMapPage() {
  const matrixRef = useRef(null);

  const handleExport = async () => {
    if (matrixRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(matrixRef.current);
      const link = document.createElement('a');
      link.download = 'heat-map.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heat Map Analysis</h1>
          <p className="text-muted-foreground">Category performance across different countries</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance by Country</CardTitle>
          <CardDescription>Heat map showing how categories perform across different countries</CardDescription>
        </CardHeader>
        <CardContent className="h-auto">
          <div ref={matrixRef}>
            <HeatMap />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
