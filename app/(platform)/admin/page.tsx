import { Settings2 } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adminResources, pricingPlans } from "@/lib/mock-data"

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Panel"
        title="Configuration and operations"
        description="Admin users manage industries, activities, benchmarks, scoring rules, intelligence rules, reports, leads, users, and pricing."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-5 text-primary" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminResources.map((resource) => (
                  <TableRow key={resource.name}>
                    <TableCell className="font-medium">{resource.name}</TableCell>
                    <TableCell className="text-right font-mono">{resource.count}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="rounded-lg border bg-secondary/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="font-mono text-sm text-primary">{plan.price}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
