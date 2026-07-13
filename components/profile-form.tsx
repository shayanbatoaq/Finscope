"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { profileOptions, sampleCompanyProfile } from "@/lib/mock-data"
import { profileSchema, type ProfileFormValues } from "@/lib/schemas"

const sections = [
  { title: "Company Information", fields: ["companyName", "country", "emirate"] },
  { title: "Business Classification", fields: ["industryFamily", "businessActivity"] },
  { title: "Business Size", fields: ["companyAge", "revenueBand", "employeeBand"] },
  { title: "License Information", fields: ["licenseType", "licenseAuthority"] },
] as const

export function ProfileForm() {
  const [saved, setSaved] = useState(false)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: sampleCompanyProfile,
  })

  function submit() {
    setSaved(true)
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      {saved ? (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>Profile saved</AlertTitle>
          <AlertDescription>
            The mock profile is ready for rules-driven regulatory and benchmark intelligence.
          </AlertDescription>
        </Alert>
      ) : null}

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.fields.map((field) => renderField(field, form))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Regulatory Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <BooleanField label="VAT registered" name="vatRegistered" form={form} />
          <BooleanField label="Corporate Tax registered" name="corporateTaxRegistered" form={form} />
          <BooleanField label="Audit required" name="auditRequired" form={form} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Records and Objective</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Financial records available"
            name="financialRecords"
            options={profileOptions.financialRecords}
            form={form}
          />
          <SelectField
            label="Primary objective"
            name="primaryObjective"
            options={profileOptions.objectives}
            form={form}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save intelligence profile</Button>
      </div>
    </form>
  )
}

function renderField(
  field: (typeof sections)[number]["fields"][number],
  form: ReturnType<typeof useForm<ProfileFormValues>>
) {
  if (field === "companyName") {
    return (
      <div key={field} className="space-y-2">
        <Label>Company name</Label>
        <Input {...form.register("companyName")} />
      </div>
    )
  }

  if (field === "companyAge") {
    return (
      <div key={field} className="space-y-2">
        <Label>Company age</Label>
        <Input {...form.register("companyAge")} />
      </div>
    )
  }

  const optionMap = {
    country: profileOptions.countries,
    emirate: profileOptions.emirates,
    industryFamily: profileOptions.industryFamilies,
    businessActivity: profileOptions.businessActivities,
    revenueBand: profileOptions.revenueBands,
    employeeBand: profileOptions.employeeBands,
    licenseType: profileOptions.licenseTypes,
    licenseAuthority: profileOptions.licenseAuthorities,
  }

  const labelMap = {
    country: "Country",
    emirate: "Emirate",
    industryFamily: "Industry family",
    businessActivity: "Business activity",
    revenueBand: "Revenue band",
    employeeBand: "Employee band",
    licenseType: "License type",
    licenseAuthority: "License authority",
  }

  return (
    <SelectField
      key={field}
      label={labelMap[field]}
      name={field}
      options={optionMap[field]}
      form={form}
    />
  )
}

function SelectField({
  label,
  name,
  options,
  form,
}: {
  label: string
  name: keyof ProfileFormValues
  options: string[]
  form: ReturnType<typeof useForm<ProfileFormValues>>
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={String(form.watch(name))}
        onValueChange={(value) => form.setValue(name, value, { shouldDirty: true, shouldValidate: true })}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function BooleanField({
  label,
  name,
  form,
}: {
  label: string
  name: "vatRegistered" | "corporateTaxRegistered" | "auditRequired"
  form: ReturnType<typeof useForm<ProfileFormValues>>
}) {
  return (
    <label className="flex items-center gap-3 rounded-md border bg-card p-4 text-sm font-medium">
      <Checkbox
        checked={form.watch(name)}
        onCheckedChange={(checked) => form.setValue(name, checked === true, { shouldDirty: true })}
      />
      {label}
    </label>
  )
}
