"use client"

import React from "react"
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

export default function WordCloudPage() {
  const words = [
    { text: 'React', value: 100 },
    { text: 'JavaScript', value: 80 },
    { text: 'TypeScript', value: 70 },
    // ... more words
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Word Cloud Analysis</h1>
          <p className="text-muted-foreground">
            Visualize common terms in content descriptions
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description Word Cloud</CardTitle>
          <CardDescription>
            Most common words in content descriptions by category and country
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[600px]">
          {/* <WordCloudComponent /> */}
          <WordCloudComponent />
        </CardContent>
      </Card>
    </div>
  )
}
