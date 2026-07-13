import { AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { vatIntelligence } from "@/lib/mock-data"

export default function VatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="VAT Intelligence"
        title="VAT position and risk review"
        description="VAT output is calculated from mapped accounts and rules, then explained with safe advisory wording."
      />
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>Indicative only, not professional advice.</AlertDescription>
      </Alert>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vatIntelligence.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-foreground">{item.value}</div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
