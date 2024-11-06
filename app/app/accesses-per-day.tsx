'use client'
import { useEffect, useState } from "react"
import MetricChart from "./metric-chart"
import { MetricsServices } from "@/services/metrics.service"
import { eachDayOfInterval, format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AccessesPerDay () {
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    const getAllMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const accessMetrics = allMetrics.filter(({ link_type, createdAt }) =>
        link_type.startsWith("origin:") &&
        new Date(createdAt) >= subDays(new Date(), 90)
      )

      const startDate = subDays(new Date(), 89)
      const endDate = new Date()
      const daysArray = eachDayOfInterval({ start: startDate, end: endDate })

      const metricsByDay = daysArray.map((day) => {
        const dateString = format(day, 'dd/MM', { locale: ptBR })
        const count = accessMetrics.filter(({ createdAt }) => 
          format(new Date(createdAt), 'dd/MM', { locale: ptBR }) === dateString
        ).length

        return { name: dateString, acessos: count } // aqui, alteramos "value" para "acessos"
      })
      
      setMetrics(metricsByDay)
    }

    getAllMetrics()
  }, [])

  return (
    <div
      className="w-full bg-white rounded-lg"
    >
      <h2
        className="p-4 text-2xl font-bold tracking-tight text-[#164F62]"
      >
        Acessos por dia
      </h2>

      <MetricChart
        label="acessos"
        data={metrics}
      />
    </div>
  )
}
