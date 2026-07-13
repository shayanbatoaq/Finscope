import { FileText } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ReportDownloadButton } from "@/components/report-download-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { finalReportSections } from "@/lib/mock-data"

export default function FinalReportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Final Report"
        title="Generate downloadable PDF"
        description="The PDF includes executive summary, statements, score outputs, benchmark comparison, tax/VAT/audit intelligence, CFO commentary, recommendations, and action plan."
        action={<ReportDownloadButton />}
      />
      <Card>
        <CardHeader>
          <CardTitle>Report Contents</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {finalReportSections.map((section) => (
            <div key={section} className="flex items-center gap-3 rounded-lg border bg-secondary/50 p-4">
              <FileText className="size-4 text-primary" />
              <span className="text-sm font-medium">{section}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
