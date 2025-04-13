import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartComponent } from "@/components/bar-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function BarChartPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Country Statistics</h1>
          <p className="text-muted-foreground">Detailed category performance by country</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-row gap-4 overflow-x-auto justify-between">
        <Card className="flex-3/4">
          <CardHeader>
            <CardTitle>Category Performance by Country</CardTitle>
            <CardDescription>Toggle between different metrics to compare category performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px]">
            <BarChartComponent />
          </CardContent>
        </Card>
        <Card className="flex-1/4">
          <CardHeader>
            {/* <CardTitle>Category Performance by Country</CardTitle> */}
            {/* <CardDescription>Toggle between different metrics to compare category performance</CardDescription> */}
          </CardHeader>
          <CardContent className="h-[500px]">
            {/* <BarChartComponent /> */}
            Analysis
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

