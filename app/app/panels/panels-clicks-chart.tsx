'use client'

import PieChartCustomLabel from "@/components/pie-chart-custom-label";
import { IMetric } from "@/interfaces/IMetrics";
import { IProject } from "@/interfaces/IProjects";
import { MetricsServices } from "@/services/metrics.service";
import { PainelService } from "@/services/panel.service";
import { useEffect, useState } from "react";

interface PanelsClicksChartProps {
  projectId: number
  allPanelsClicksMetrics: IMetric[]
}

export default function PanelsClicksChart ({
  allPanelsClicksMetrics,
  projectId
}: PanelsClicksChartProps) {
  const [clicksMetrics, setClicksMetrics] = useState([])

  const colorPalette = [
    "hsl(0, 70%, 50%)",
    "hsl(45, 70%, 50%)",
    "hsl(120, 70%, 50%)",
    "hsl(200, 70%, 50%)",
    "hsl(280, 70%, 50%)",
  ]

  const getColor = (index: number) => colorPalette[index % colorPalette.length]

  useEffect(() => {
    const getPanelsClicksMetrics = async () => {
      try {
        if (!projectId || !allPanelsClicksMetrics) return

        const panels = await PainelService.onGetAllPanels()

        console.log({projectId, allPanelsClicksMetrics })

        const panelsClicksMetrics = panels.filter(({ project_id }) => Number(project_id) === Number(projectId)).map((panel, index) => {
          const panelId = panel.id

          const clicks = allPanelsClicksMetrics.reduce((count, metric) => {
            const metricId = metric.link_type.split('-').pop()
            return Number(metricId) === Number(panelId) ? count + 1 : count
          }, 0)

          return {
            name: panel.painel_title,
            cliques: clicks,
            fill: getColor(index)
          }
        }).filter(({ cliques }) => cliques > 0)

        setClicksMetrics(panelsClicksMetrics)

        console.log({ panelsClicksMetrics })
      } catch (error) {
        console.log("PanelsClicksChart: ", error)
      }
    }

    getPanelsClicksMetrics()
  }, [projectId, allPanelsClicksMetrics])

  return (
    <div>
      <PieChartCustomLabel 
        label="cliques"
        metrics={clicksMetrics}
        key="cliques"
      />
    </div>
  )
}