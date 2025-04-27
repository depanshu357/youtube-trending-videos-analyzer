import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PredictionForm } from "@/components/prediction-form"

export default function PredictionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">YouTube Engagement Predictor</h1>
        <p className="text-muted-foreground">Predict expected engagement metrics based on video attributes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Prediction</CardTitle>
          <CardDescription>Select video attributes to predict likes, views, comments, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <PredictionForm />
        </CardContent>
      </Card>
    </div>
  )
}
