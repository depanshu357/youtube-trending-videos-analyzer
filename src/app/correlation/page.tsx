'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CorrelationMatrix } from "@/components/correlation-matrix"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRef } from "react";
import { toPng, toJpeg } from "html-to-image"


export default function CorrelationPage() {
  const matrixRef = useRef(null);

  const handleExport = async () => {
    if (matrixRef.current === null) {
      return;
    }

    try {
      console.log("here");
      const dataUrl = await toPng(matrixRef.current);
      const link = document.createElement('a');
      link.download = 'correlation-matrix.png';
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
          <h1 className="text-3xl font-bold tracking-tight">Correlation Matrix</h1>
          <p className="text-muted-foreground">Relationships between different metrics</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metric Correlations</CardTitle>
          <CardDescription>Analyzing relationships between likes, views, comments, duration, and more</CardDescription>
        </CardHeader>
        <CardContent className="h-[600px]">
          <div ref={matrixRef}>
            <CorrelationMatrix />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
