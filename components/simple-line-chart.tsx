'use client'

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  gratuito: {
    label: "Free",
    color: "#20B120",
  },
  pro: {
    label: "Pro",
    color: "#164F62",
  },
  premium: {
    label: "Premium",
    color: "#299FC7",
  },
} satisfies ChartConfig;

interface SimpleLineChartProps {
  data: {
    month: string;
    basic: number;
    pro: number;
    premium: number;
  }[];
  chartClassName?: string;
  containerClassName?: string;
}

export default function SimpleLineChart({
  data,
  chartClassName = "",
  containerClassName = "",
}: SimpleLineChartProps) {

  const transformedData = data.map((item) => ({
    month: item.month,
    gratuito: item.basic,
    pro: item.pro,
    premium: item.premium,
  }));

  return (
    <Card className={containerClassName}>
      {/* <CardHeader>
        <CardTitle>Plano dos usuários</CardTitle>
        <CardDescription>Janeiro - Dezembro</CardDescription>
      </CardHeader> */}
      <CardContent>
        <ChartContainer config={chartConfig} style={{ width: "100%" }} className={cn(chartClassName)}>
          <LineChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="gratuito"
              type="linear"
              stroke={chartConfig.gratuito.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="pro"
              type="linear"
              stroke={chartConfig.pro.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="premium"
              type="linear"
              stroke={chartConfig.premium.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Subindo 5,2% este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando total de planos adquiridos nos últimos 12 meses
        </div>
      </CardFooter> */}
    </Card>
  );
}
