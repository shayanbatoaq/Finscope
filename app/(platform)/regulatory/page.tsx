import { AlertCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { regulatoryCards } from "@/lib/mock-data"

export default function RegulatoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Regulatory Intelligence"
        title="Relevant awareness cards"
        description="Rules classify the profile and surface VAT, Corporate Tax, QFZP, Transfer Pricing, UBO, AML, audit, and record keeping considerations."
      />
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>Important disclaimer</AlertTitle>
        <AlertDescription>
          Indicative only. Not legal, tax, audit, or professional advice.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {regulatoryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{card.title}</CardTitle>
                <Badge variant="outline">{card.relevance}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className="bg-secondary text-secondary-foreground" variant="secondary">
                {card.status}
              </Badge>
              <p className="text-sm leading-6 text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
