import { PageHeader } from "@/components/page-header"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Business Intelligence Profile"
        title="Company and regulatory profile"
        description="Profile inputs drive awareness cards, benchmark selection, scoring rules, report sections, and expert review routing."
      />
      <ProfileForm />
    </div>
  )
}
