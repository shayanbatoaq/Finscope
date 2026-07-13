import { PageHeader } from "@/components/page-header"
import { MappingWorkbench } from "@/components/mapping-workbench"

export default function MappingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI Account Mapping"
        title="Standardize accounts before calculations"
        description="Mapping suggestions can be reviewed and edited. Low-confidence accounts are visibly flagged before processing."
      />
      <MappingWorkbench />
    </div>
  )
}
