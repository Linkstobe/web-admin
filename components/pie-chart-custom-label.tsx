import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Metric = {
  name: string
  [key: string]: number | string
  fill: string
}

interface PieChartCustomLabelProps {
  label: string
  metrics: Metric[]
}

export default function PieChartCustomLabel ({
  metrics,
  label
}: PieChartCustomLabelProps) {
  const chartConfig = {
    cliques: {
      label,
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie
              style={{ height: "300px" }}
              data={metrics}
              dataKey="cliques" // Atualize para a chave correta
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.cliques}
                  </text>
                );
              }}
              nameKey="name"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}