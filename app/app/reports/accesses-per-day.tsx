'use client'
import { useEffect, useState } from "react"
import { MetricsServices } from "@/services/metrics.service"
import { eachDayOfInterval, format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { IMetric } from "@/interfaces/IMetrics"
import MetricChart from "./metric-chart"

export default function AccessesPerDay() {
  const [metricsPerDay, setMetricsPerDay] = useState([])

  useEffect(() => {
    const getAllMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const startDate = subDays(new Date(), 89)
      const endDate = new Date()
      const daysArray = eachDayOfInterval({ start: startDate, end: endDate })

      const accessMetrics = allMetrics.filter(({ link_type, createdAt }) =>
        link_type.startsWith("origin:") &&
        new Date(createdAt) >= startDate
      )

      const clicksMetrics = allMetrics.filter(({ link_type, createdAt }) =>
        link_type.startsWith("click:") &&
        new Date(createdAt) >= startDate
      )

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
  }, [])

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
