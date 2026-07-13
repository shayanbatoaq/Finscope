"use client"

import { useEffect, useRef, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const colors = {
  primary: "#2e4455",
  teal: "#4b9c96",
  amber: "#c99232",
  slate: "#6b7f8d",
}

type BenchmarkDatum = {
  metric: string
  company: number
  industry: number
}

type GrowthDatum = {
  period: string
  industry: number
  company: number
}

type ScoreDatum = {
  label: string
  value: number
}

export function BenchmarkChart({ data }: { data: BenchmarkDatum[] }) {
  const { ref, width } = useChartSize()

  return (
    <div ref={ref} className="h-80 w-full">
      {width > 0 ? (
        <BarChart width={width} height={320} data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c9d6dd" vertical={false} />
          <XAxis dataKey="metric" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(46,68,85,0.06)" }}
            contentStyle={{ borderRadius: 8, borderColor: "#c9d6dd" }}
          />
          <Bar dataKey="industry" fill={colors.slate} radius={[4, 4, 0, 0]} />
          <Bar dataKey="company" fill={colors.primary} radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <div className="h-full w-full rounded-lg bg-muted/50" />
      )}
    </div>
  )
}

export function GrowthChart({ data }: { data: GrowthDatum[] }) {
  const { ref, width } = useChartSize()

  return (
    <div ref={ref} className="h-72 w-full">
      {width > 0 ? (
        <AreaChart width={width} height={288} data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={colors.teal} stopOpacity={0.28} />
              <stop offset="95%" stopColor={colors.teal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#c9d6dd" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#c9d6dd" }} />
          <Area
            type="monotone"
            dataKey="industry"
            stroke={colors.teal}
            fill="url(#growthFill)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="company"
            stroke={colors.primary}
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </AreaChart>
      ) : (
        <div className="h-full w-full rounded-lg bg-muted/50" />
      )}
    </div>
  )
}

export function ScoreDistribution({ data }: { data: ScoreDatum[] }) {
  const { ref, width } = useChartSize()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Readiness Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="h-72 w-full">
          {width > 0 ? (
            <BarChart width={width} height={288} data={data} layout="vertical" margin={{ top: 8, right: 16, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c9d6dd" horizontal={false} />
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis
                type="category"
                dataKey="label"
                width={112}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#c9d6dd" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={[colors.primary, colors.teal, colors.amber, colors.slate][index % 4]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <div className="h-full w-full rounded-lg bg-muted/50" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function useChartSize() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setWidth(Math.max(1, Math.floor(node.getBoundingClientRect().width)))
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return { ref, width }
}
