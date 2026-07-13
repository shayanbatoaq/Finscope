import { BrandLogo } from "@/components/brand-logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden border-r border-border/80 bg-primary px-10 py-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <BrandLogo imageClassName="h-12 brightness-0 invert" />
        <div>
          <p className="max-w-xl text-4xl font-semibold leading-tight">
            CFO, audit, tax, benchmark, and valuation intelligence from one structured assessment flow.
          </p>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/72">
            FinScope AI calculates financial results first, applies rules and benchmarks second, then uses AI only for explanation and action-plan wording.
          </p>
        </div>
        <p className="text-xs text-white/60">Indicative only. Requires professional review.</p>
      </section>
      <section className="flex min-h-screen flex-col">
        <div className="flex h-20 items-center px-6 lg:hidden">
          <BrandLogo imageClassName="h-10" />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-10">{children}</div>
      </section>
    </main>
  )
}
