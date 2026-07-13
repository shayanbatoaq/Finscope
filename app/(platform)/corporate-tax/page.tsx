import { AlertCircle, CheckCircle2 } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { corporateTaxIndicators, corporateTaxItems } from "@/lib/mock-data"

export default function CorporateTaxPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Corporate Tax Intelligence"
        title="Tax readiness and indicators"
        description="The system calculates readiness and highlights rule-triggered risk and opportunity categories."
      />
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Advisory only</AlertTitle>
        <AlertDescription>
          Corporate Tax intelligence is advisory only, indicative, requires professional review, and is not professional advice.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 md:grid-cols-2">
        {corporateTaxItems.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Indicators</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {corporateTaxIndicators.map((indicator) => (
            <Badge key={indicator} variant="outline" className="border-primary/20 bg-white">
              <CheckCircle2 className="size-3" />
              {indicator}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
