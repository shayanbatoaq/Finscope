import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { BenchmarkChart, ScoreDistribution } from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { landingFeatures, benchmarkRows, scoreCards } from "@/lib/mock-data"

const featureIcons = [BarChart3, ShieldCheck, ClipboardCheck, Building2, CheckCircle2, Sparkles]

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo priority imageClassName="h-12" />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Start Assessment</Link>
          </Button>
        </nav>
      </header>

      <section className="relative overflow-hidden border-y border-border/80 bg-[#e9eef1]">
        <div className="absolute inset-0 opacity-80">
          <div className="mx-auto grid h-full max-w-7xl grid-cols-6 gap-4 px-4 py-10 sm:px-6 lg:px-8">
            {scoreCards.map((score) => (
              <div key={score.label} className="hidden rounded-lg border border-white/80 bg-white/60 shadow-sm md:block" />
            ))}
            <div className="col-span-6 hidden rounded-lg border border-white/80 bg-white/50 shadow-sm lg:block" />
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <Badge variant="outline" className="mx-auto mb-6 border-primary/20 bg-white/70 text-primary">
            AI commentary. System calculations. Rules-driven intelligence.
          </Badge>
          <h1 className="mx-auto max-w-5xl text-4xl font-semibold tracking-normal text-primary sm:text-6xl lg:text-7xl">
            Upload Your Trial Balance. Receive CFO, Audit, Tax and Business Intelligence in Minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            FinScope AI is an AI CFO, Audit, Tax and Business Intelligence platform for business owners who need trusted financial clarity without waiting weeks for manual analysis.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/profile">
                Start Assessment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {landingFeatures.map((feature, index) => {
          const Icon = featureIcons[index]

          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Dashboard preview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Enterprise-grade financial intelligence workspace</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">View dashboard</Link>
          </Button>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarking</CardTitle>
            </CardHeader>
            <CardContent>
              <BenchmarkChart data={benchmarkRows} />
            </CardContent>
          </Card>
          <ScoreDistribution data={scoreCards.map((score) => ({ label: score.label.replace(" Readiness", ""), value: score.value }))} />
        </div>
      </section>

      <footer className="border-t border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
        FinScope AI outputs are indicative, require professional review, and are not professional advice.
      </footer>
    </main>
  )
}
