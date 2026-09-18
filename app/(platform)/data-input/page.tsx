import { PageHeader } from "@/components/page-header"
import { DataInputWorkbench } from "@/components/data-input-workbench"

export default function DataInputPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Data Input"
        title="Trial balance"
      />
      <DataInputWorkbench />
    </div>
  )
}
