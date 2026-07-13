"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { expertReviewServices } from "@/lib/mock-data"
import { leadSchema, type LeadFormValues } from "@/lib/schemas"

export function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "CFO Advisory",
      notes: "",
    },
  })
  const selectedService = useWatch({ control: form.control, name: "service" })

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(() => {
        setSubmitted(true)
        form.reset()
      })}
    >
      {submitted ? (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>Lead captured</AlertTitle>
          <AlertDescription>
            This request is ready to be stored in the expert_review_leads table and surfaced in Admin.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </Field>
        <Field label="Company" error={form.formState.errors.company?.message}>
          <Input {...form.register("company")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} />
        </Field>
      </div>

      <div className="space-y-2">
        <Label>Review service</Label>
        <Select
          value={selectedService}
          onValueChange={(value) => form.setValue("service", value, { shouldDirty: true, shouldValidate: true })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {expertReviewServices.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea rows={5} {...form.register("notes")} />
      </div>

      <Button type="submit">Request AMA expert review</Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
