import { Handshake } from "lucide-react"

import { LeadForm } from "@/components/lead-form"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { expertReviewServices } from "@/lib/mock-data"

export default function ExpertReviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AMA Expert Review"
        title="Route assessment to an expert"
        description="Capture leads for audit, tax, VAT, financial statements, bookkeeping, CFO advisory, and valuation services."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Available Review Services</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {expertReviewServices.map((service) => (
              <div key={service} className="flex items-center gap-3 rounded-lg border bg-secondary/50 p-4 text-sm font-medium">
                <Handshake className="size-4 text-primary" />
                {service}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Capture</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
