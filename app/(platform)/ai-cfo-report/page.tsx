import { Sparkles } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cfoReportSections } from "@/lib/mock-data"

export default function AiCfoReportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI CFO Report"
        title="System-calculated CFO commentary"
        description="AI drafts explanation, summary wording, recommendations, and action plans from calculated outputs only."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {cfoReportSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-lg border bg-secondary/50 p-3">
                    {bullet}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
