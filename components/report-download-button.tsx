import Link from "next/link"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ReportDownloadButton() {
  return (
    <Button asChild>
      <Link href="/api/reports/sample" target="_blank">
        <Download className="size-4" />
        Download PDF
      </Link>
    </Button>
  )
}
