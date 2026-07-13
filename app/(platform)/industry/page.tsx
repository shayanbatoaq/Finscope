import { BenchmarkChart, GrowthChart } from "@/components/charts"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  benchmarkRows,
  growthRows,
  performanceGaps,
  sampleCompanyProfile,
} from "@/lib/mock-data"

export default function IndustryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Industry Performance"
        title="Benchmark comparison"
        description="Company metrics are compared against admin-managed industry and business activity benchmarks."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Industry" value={sampleCompanyProfile.industryFamily} />
        <InfoCard label="Business Activity" value={sampleCompanyProfile.businessActivity} />
        <InfoCard label="Company Size" value={sampleCompanyProfile.revenueBand} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Company vs Industry Benchmark</CardTitle>
          </CardHeader>
          <CardContent>
            <BenchmarkChart data={benchmarkRows} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Industry Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={growthRows} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {performanceGaps.map((gap) => (
          <Card key={gap.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{gap.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-semibold">{gap.value}</div>
              <Badge className="mt-3" variant={gap.tone === "Positive" ? "secondary" : "outline"}>
                {gap.tone}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
