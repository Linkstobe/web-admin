'use client'

import { useEffect, useState } from "react"
import { eachDayOfInterval, format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { IMetric } from "@/interfaces/IMetrics"
import MetricChart from "./metric-chart"
import { DateRange } from "react-day-picker"

interface AccessesPerDayProps {
  accessMetrics: IMetric[]
  clicksMetrics: IMetric[]
  dateRange: DateRange | undefined
}

export default function AccessesPerDay ({
  accessMetrics,
  clicksMetrics,
  dateRange
}: AccessesPerDayProps) {
  const [metricsPerDay, setMetricsPerDay] = useState([])

  useEffect(() => {
    const getAllMetrics = async () => {
      if (!accessMetrics || !clicksMetrics) return

      const startDate = dateRange?.from || subDays(new Date(), 89)
      const endDate = dateRange?.to || new Date()

      const daysArray = eachDayOfInterval({ start: startDate, end: endDate })

      const metricsByDay = daysArray.map((day) => {
        const dateString = format(day, 'dd/MM', { locale: ptBR })

        const accessCount = accessMetrics.filter(({ createdAt }) =>
          format(new Date(createdAt), 'dd/MM', { locale: ptBR }) === dateString
        ).length

        const clickCount = clicksMetrics.filter(({ createdAt }) =>
          format(new Date(createdAt), 'dd/MM', { locale: ptBR }) === dateString
        ).length

        return { name: dateString, acessos: accessCount, cliques: clickCount }
      })

      setMetricsPerDay(metricsByDay)
    }

    getAllMetrics()
  }, [accessMetrics, clicksMetrics, dateRange])

  return (
    <div className="w-full bg-white rounded-lg">
      <h2 className="p-4 text-2xl font-bold tracking-tight text-[#164F62]">
        Acessos e cliques por dia
      </h2>

      <MetricChart
        label="acessos"
        data={metricsPerDay}
        secondLabel="cliques"
      />
    </div>
  )
}
