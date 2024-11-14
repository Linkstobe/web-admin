'use client'
import { useEffect, useState } from "react"
import MetricChart from "./metric-chart"
import { MetricsServices } from "@/services/metrics.service"
import { subDays } from "date-fns"
import { IMetric } from "@/interfaces/IMetrics"

export default function AccessesPerHour () {
  const [accessesPerHourMetrics, setAccessesPerHourMetrics] = useState([])

  useEffect(() => {
    const getAllMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const accessMetrics = allMetrics.filter(({ link_type, createdAt }) =>
        link_type.startsWith("origin:") &&
        new Date(createdAt) >= subDays(new Date(), 90)
      )

      const hourlyAccesses = Array.from({ length: 24 }, (_, i) => ({
        name: `${i}h`,
        acessos: 0,
      }))

      accessMetrics.forEach(({ createdAt }) => {
        const hour = new Date(createdAt).getHours()
        hourlyAccesses[hour].acessos += 1
      })

      setAccessesPerHourMetrics(hourlyAccesses)
    }

    getAllMetrics()
  }, [])

  return (
    <div className="w-full bg-white rounded-lg">
      <h2 className="p-4 text-2xl font-bold tracking-tight text-[#164F62]">
        Acessos por hora
      </h2>
      <MetricChart label="acessos" data={accessesPerHourMetrics} />
    </div>
  )
}
