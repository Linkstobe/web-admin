'use client'
import { useEffect, useState } from "react"
import EngagementCard from "./engagement-card"
import { ProjectCreationMetrics, ProjectService } from "@/services/project.service"
import { catchError } from "@/lib/utils"

export default function ProjectEngagementCard () {

  const [projectCreationMetrics, setProjectCreationMetrics] = useState<ProjectCreationMetrics>({
    total: 0,
    lastWeek: 0,
    lastMonth: 0
  });


  useEffect(() => {
    (async () => {
      const [err, metrics] = await catchError(ProjectService.findClikedResume());
      if (err) console.error(err);
      setProjectCreationMetrics(metrics);
    })();
  }, [])

  return (
    <div
      className="grid grid-cols-[2fr_1fr] gap-4"
    >
      <div
        className="grid grid-cols-2 gap-4"
      >
        <EngagementCard 
          title="Total de links criados"
          value={projectCreationMetrics.total}
        />

        <EngagementCard 
          title="Links Criados nos últimos 7 dias"
          value={projectCreationMetrics.lastWeek}
        />
      </div>

      <EngagementCard 
        title="Links Criados nos últimos 30 dias"
        value={projectCreationMetrics.lastMonth}
      />
    </div>
  )
}