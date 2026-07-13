import { PageHeader } from "@/components/page-header"
import { DataInputWorkbench } from "@/components/data-input-workbench"

export default function DataInputPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Data Input"
        title="Upload or enter a trial balance"
        description="Accept Excel, CSV, or PDF uploads, or manually capture Account Name, Debit, and Credit lines."
      />
      <DataInputWorkbench />
    </div>
  )
}
