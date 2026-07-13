"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  accountMappings,
  mappingCategories,
  type AccountMapping,
  type MappingConfidence,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const confidenceClass: Record<MappingConfidence, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-red-200 bg-red-50 text-red-700",
}

export function MappingWorkbench() {
  const [rows, setRows] = useState<AccountMapping[]>(accountMappings)

  function updateCategory(id: string, category: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              category,
              confidence: row.confidence === "Low" ? "Medium" : row.confidence,
            }
          : row
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Standardized Account Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Standard Category</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className={row.confidence === "Low" ? "bg-red-50/60" : undefined}>
                  <TableCell className="min-w-56 font-medium">
                    <div className="flex items-center gap-2">
                      {row.confidence === "Low" ? <AlertTriangle className="size-4 text-red-600" /> : null}
                      {row.accountName}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-60">
                    <Select value={row.category} onValueChange={(value) => updateCategory(row.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", confidenceClass[row.confidence])}>
                      {row.confidence}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">{row.rationale}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
