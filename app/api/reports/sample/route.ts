import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"

import { FinScopeReportPdf } from "@/components/report-pdf"

export const runtime = "nodejs"

export async function GET() {
  const pdf = await renderToBuffer(React.createElement(FinScopeReportPdf))
  const body = new ArrayBuffer(pdf.byteLength)
  new Uint8Array(body).set(pdf)

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="finscope-ai-report.pdf"',
      "Cache-Control": "no-store",
    },
  })
}
