"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Metric = {
  name: string
  [key: string]: number | string
}

interface MetricsBarChartProps {
  label: string
  metrics: Metric[]
}

export function MetricsBarChart({
  label,
  metrics,
}: MetricsBarChartProps) {
  const chartConfig = {
    desktop: {
      label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          style={{
            width: "100%",
            height: "500px",
          }}
        >
          <BarChart
            accessibilityLayer
            data={metrics}
            className="w-full"
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={label} fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
