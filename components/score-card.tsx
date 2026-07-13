import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type RiskLevel = "Low" | "Medium" | "High"

type ScoreCardProps = {
  label: string
  value: number
  status: string
  risk: RiskLevel
  detail: string
  trend?: "up" | "down" | "flat"
}

const riskClass: Record<RiskLevel, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  High: "border-red-200 bg-red-50 text-red-700",
}

export function ScoreCard({
  label,
  value,
  status,
  risk,
  detail,
  trend = "flat",
}: ScoreCardProps) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus

  return (
    <Card className="min-h-44">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          <Badge variant="outline" className={cn("border", riskClass[risk])}>
            {risk} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono text-4xl font-semibold text-foreground">
              {value}
            </div>
            <p className="mt-1 text-sm font-medium text-primary">{status}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
            <TrendIcon className="size-4" />
          </div>
        </div>
        <Progress value={value} className="h-1.5" />
        <p className="text-sm leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
