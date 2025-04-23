import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/line-chart"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function LineChartPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Category Trends</h1>
          <p className="text-muted-foreground">Track how different YouTube categories trend over time</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Trends Over Time</CardTitle>
          <CardDescription>Select a date range to analyze YouTube category performance trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[550px]">
          <LineChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Key insights from the trending data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Seasonal Patterns</h3>
              <p className="text-sm text-muted-foreground">
                Music videos show strong performance in summer months, while Gaming content peaks during winter.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Growth Categories</h3>
              <p className="text-sm text-muted-foreground">
                How-to & Style and Science & Tech categories have shown the most consistent growth over the past year.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Engagement Correlation</h3>
              <p className="text-sm text-muted-foreground">
                Categories with higher view counts typically show stronger subscriber growth and higher average watch
                times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
