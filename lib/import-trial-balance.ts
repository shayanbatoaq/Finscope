import Papa from "papaparse"
import readXlsxFile from "read-excel-file/browser"
import {
  isLedgerHeader,
  rowsToLedgerEntries,
  type ImportResult,
} from "./trial-balance"

export type ImportSheet = { name: string; data: unknown[][] }

export async function readTrialBalance(file: File): Promise<ImportSheet[]> {
  if (file.size > 20 * 1024 * 1024)
    throw new Error("This file is too large. Choose a file smaller than 20 MB.")
  const extension = file.name.split(".").pop()?.toLowerCase()
  if (extension === "xlsx") {
    const sheets = await readXlsxFile(file)
    return sheets.map((sheet) => ({ name: sheet.sheet, data: sheet.data }))
  }
  if (extension === "csv") {
    const parsed = Papa.parse<string[]>(await file.text(), {
      skipEmptyLines: "greedy",
    })
    if (parsed.errors.some((error) => error.type === "Quotes"))
      throw new Error(
        "The CSV contains unmatched quotes. Correct the file or use the Excel template."
      )
    return [{ name: file.name, data: parsed.data }]
  }
  if (extension === "pdf")
    return [{ name: file.name, data: await readPdfRows(file) }]
  throw new Error("Choose an XLSX, CSV, or PDF file.")
}

export function parseImportSheet(sheet: ImportSheet): ImportResult {
  return rowsToLedgerEntries(sheet.data)
}

type PdfCell = { text: string; x: number; y: number; width: number }

async function readPdfRows(file: File): Promise<unknown[][]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    useSystemFonts: true,
  })
  try {
    const pdf = await task.promise
    const rows: unknown[][] = []
    let columns: PdfCell[] = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      const lines: PdfCell[][] = []
      for (const item of content.items) {
        if (!("str" in item) || !item.str.trim()) continue
        const cell = {
          text: item.str.trim(),
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
        }
        const line = lines.find((line) => Math.abs(line[0].y - cell.y) < 3)
        if (line) line.push(cell)
        else lines.push([cell])
      }
      for (const line of lines.sort((a, b) => b[0].y - a[0].y)) {
        const cells: PdfCell[] = []
        for (const cell of line.sort((a, b) => a.x - b.x)) {
          const previous = cells.at(-1)
          if (previous && cell.x - (previous.x + previous.width) < 12) {
            previous.text += ` ${cell.text}`
            previous.width = cell.x + cell.width - previous.x
          } else cells.push({ ...cell })
        }
        if (isLedgerHeader(cells.map((cell) => cell.text))) {
          columns = cells
          if (!rows.length) rows.push(columns.map((cell) => cell.text))
          continue
        }
        if (columns.length) {
          const values = columns.map(() => "")
          for (const cell of cells) {
            // Compare cell centers to header centers to support right-aligned amounts.
            const center = cell.x + cell.width / 2
            const distances = columns.map((column) =>
              Math.abs(center - (column.x + column.width / 2))
            )
            const columnIndex = distances.indexOf(Math.min(...distances))
            values[columnIndex] = `${values[columnIndex]} ${cell.text}`.trim()
          }
          rows.push(values)
        }
      }
      page.cleanup()
    }
    if (!rows.length)
      throw new Error(
        "No readable ledger table found in this PDF. Scanned PDFs need a text-based export; you can also use the Excel template or enter the ledgers manually."
      )
    return rows
  } finally {
    await task.destroy()
  }
}
