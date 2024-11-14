'use client'
import AnalyticsPieChart from "@/components/analytics-pie-chart"
import { IMetric } from "@/interfaces/IMetrics";
import { MetricsServices } from "@/services/metrics.service";
import { useEffect, useState } from "react"

export default function AccessesByOperatingSystem () {
  const [operatingSystemAccessMetrics, setOperatingSystemAccessMetrics] = useState([]);

  useEffect(() => {
    const getOperatingSystemMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const accessMetrics = allMetrics.filter(({ link_type }) => link_type.startsWith("origin:"))
      
      const systemCounts = accessMetrics.reduce((acc, { system }) => {
        const found = acc.find((item) => item.name === system);
        if (found) {
          found.value += 1;
        } else {
          acc.push({ name: system, value: 1 });
        }
  
        return acc;
      }, []);
  
      setOperatingSystemAccessMetrics(systemCounts);
    }

    getOperatingSystemMetrics()
  }, [])

  return (
    <div
      className="flex flex-col gap-4"
    >
      <h3
        className="text-2xl font-bold tracking-tight text-[#164F62]"
      >
        Sistemas operacionais
      </h3>
      <AnalyticsPieChart
        label="Acessos"
        backgroundColor={["#FF6347", "#4682B4", "#1E90FF", "#A9A9A9", "#87CEFA", "#32CD32"]}
        hoverBackgroundColor={["#E5533B", "#357AB9", "#1C7AC0", "#8C8C8C", "#6BAED7", "#28A428"]}
        metrics={operatingSystemAccessMetrics}
      />
    </div>
  )
}