import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/calculations"
import { financialStatements, notesToFinancialStatements } from "@/lib/mock-data"

export default function FinancialStatementsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Financial Statements"
        title="Generated statement pack"
        description="Placeholder statement logic is structured for real calculations, review workflows, and final PDF generation."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {financialStatements.map((statement) => (
          <Card key={statement.title}>
            <CardHeader>
              <CardTitle>{statement.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line item</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Prior</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statement.rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.current)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.prior)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notes to Financial Statements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {notesToFinancialStatements.map((note) => (
            <div key={note} className="rounded-lg border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
              {note}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
