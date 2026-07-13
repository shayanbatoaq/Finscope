import { CheckCircle2, Loader2 } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { processingSteps } from "@/lib/mock-data"

export default function ProcessingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Processing"
        title="Assessment generation in progress"
        description="The system prepares statements, calculates KPIs, compares benchmarks, applies rules, and assembles the report."
      />
      <Card>
        <CardContent className="space-y-5 pt-4">
          {processingSteps.map((step, index) => {
            const complete = index < 4
            const active = index === 4
            const value = complete ? 100 : active ? 62 : 0

            return (
              <div key={step} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[220px_1fr_auto] sm:items-center">
                <div className="flex items-center gap-3 font-medium">
                  {complete ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : active ? (
                    <Loader2 className="size-5 animate-spin text-primary" />
                  ) : (
                    <span className="size-5 rounded-full border border-border" />
                  )}
                  {step}
                </div>
                <Progress value={value} className="h-2" />
                <span className="font-mono text-sm text-muted-foreground">{value}%</span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
