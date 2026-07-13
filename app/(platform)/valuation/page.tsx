import { AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { valuationMethods } from "@/lib/mock-data"

export default function ValuationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Business Valuation"
        title="Indicative valuation range"
        description="Valuation uses placeholder methods and is structured for admin-managed multiples and professional review."
      />
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Indicative valuation only</AlertTitle>
        <AlertDescription>
          This output is indicative only, requires professional valuation review, and is not professional advice.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {valuationMethods.map((method) => (
          <Card key={method.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{method.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-primary">{method.value}</div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{method.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
