"use client"

import React, { useRef } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WordCloudComponent } from "@/components/word-cloud"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toPng } from "html-to-image"

export default function WordCloudPage() {
  // const words = [
  //   { text: 'React', value: 100 },
  //   { text: 'JavaScript', value: 80 },
  //   { text: 'TypeScript', value: 70 },
  //   // ... more words
  // ];
  const matrixRef = useRef(null);

  const handleExport = async () => {
    if (matrixRef.current === null) {
      return;
    }

    try {
      console.log("Exporting word cloud");
      const dataUrl = await toPng(matrixRef.current);
      const link = document.createElement('a');
      link.download = 'word-cloud.png';
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
          <h1 className="text-3xl font-bold tracking-tight">Word Cloud Analysis</h1>
          <p className="text-muted-foreground">
            Visualize frequent tags in YouTube videos.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tags Word Cloud</CardTitle>
          <CardDescription>
            Most common Tags in YouTube Videos by category and country
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[600px]">
          <div ref={matrixRef} className="bg-white">
            <WordCloudComponent />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}