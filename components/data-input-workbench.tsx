"use client"

import { useMemo, useState } from "react"
import readXlsxFile from "read-excel-file/browser"
import { FileSpreadsheet, Plus, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { trialBalanceAccounts, type TrialBalanceAccount } from "@/lib/mock-data"

export function DataInputWorkbench() {
  const [rows, setRows] = useState<TrialBalanceAccount[]>(trialBalanceAccounts.slice(0, 8))
  const [manual, setManual] = useState({ accountName: "", debit: "", credit: "" })
  const totals = useMemo(
    () => ({
      debit: rows.reduce((sum, row) => sum + row.debit, 0),
      credit: rows.reduce((sum, row) => sum + row.credit, 0),
    }),
    [rows]
  )

  async function handleFile(file: File) {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      setRows(trialBalanceAccounts.slice(0, 12))
      return
    }

    const rows = file.name.toLowerCase().endsWith(".csv")
      ? parseCsv(await file.text())
      : ((await readXlsxFile(file)) as unknown as unknown[][])
    const parsed = rowsToAccounts(rows).slice(0, 30)

    if (parsed.length) {
      setRows(parsed)
    }
  }

  function addManualRow() {
    if (!manual.accountName.trim()) return
    setRows((current) => [
      ...current,
      {
        id: `manual-${current.length + 1}`,
        accountName: manual.accountName,
        debit: Number(manual.debit || 0),
        credit: Number(manual.credit || 0),
      },
    ])
    setManual({ accountName: "", debit: "", credit: "" })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Excel, CSV, or PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/60 p-6 text-center transition-colors hover:bg-secondary">
              <UploadCloud className="size-10 text-primary" />
              <span className="mt-3 text-sm font-medium">Choose trial balance file</span>
              <span className="mt-1 text-xs text-muted-foreground">XLSX, CSV, or PDF</span>
              <Input
                className="sr-only"
                type="file"
                accept=".xlsx,.xls,.csv,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleFile(file)
                }}
              />
            </label>
            <div className="rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">
              Uploaded files are structured for Supabase Storage bucket persistence once project environment variables are configured.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Trial Balance Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                value={manual.accountName}
                onChange={(event) => setManual((current) => ({ ...current, accountName: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Debit</Label>
                <Input
                  inputMode="decimal"
                  value={manual.debit}
                  onChange={(event) => setManual((current) => ({ ...current, debit: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Credit</Label>
                <Input
                  inputMode="decimal"
                  value={manual.credit}
                  onChange={(event) => setManual((current) => ({ ...current, credit: event.target.value }))}
                />
              </div>
            </div>
            <Button type="button" onClick={addManualRow}>
              <Plus className="size-4" />
              Add account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-primary" />
            Trial Balance Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.accountName}</TableCell>
                    <TableCell className="text-right font-mono">{row.debit.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{row.credit.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-secondary/70 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">{totals.debit.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{totals.credit.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function rowsToAccounts(rows: unknown[][]): TrialBalanceAccount[] {
  const [headerRow, ...bodyRows] = rows
  const headers = headerRow?.map((cell) => String(cell ?? "").trim().toLowerCase()) ?? []
  const accountIndex = findHeader(headers, ["account name", "account", "name"], 0)
  const debitIndex = findHeader(headers, ["debit", "dr"], 1)
  const creditIndex = findHeader(headers, ["credit", "cr"], 2)

  return bodyRows
    .filter((row) => row.some((cell) => String(cell ?? "").trim().length > 0))
    .map((row, index) => ({
      id: `upload-${index}`,
      accountName: String(row[accountIndex] ?? `Uploaded account ${index + 1}`),
      debit: Number(row[debitIndex] ?? 0),
      credit: Number(row[creditIndex] ?? 0),
    }))
}

function findHeader(headers: string[], candidates: string[], fallback: number) {
  const index = headers.findIndex((header) => candidates.includes(header))
  return index >= 0 ? index : fallback
}

function parseCsv(text: string) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")))
}
