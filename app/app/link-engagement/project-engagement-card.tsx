'use client'
import { useEffect, useState } from "react"
import EngagementCard from "./engagement-card"
import { IProject } from "@/interfaces/IProjects"
import { ProjectService } from "@/services/project.service"

interface ProjectEngagementCardProps {
  projects: IProject[]
}

type ProjectCreationMetrics = {
  total: number
  inTheLastSevenDays: number
  inTheLastMonth: number
}

export default function ProjectEngagementCard ({
  projects
}: ProjectEngagementCardProps) {
  const [projectCreationMetrics, setProjectCreationMetrics] = useState<ProjectCreationMetrics>({
    total: 0,
    inTheLastSevenDays: 0,
    inTheLastMonth: 0
  })

  useEffect(() => {
    const getProjectCreationMetrics = async () => {
      const validProjects: IProject[] = projects.filter(({ linkstoBe }) =>
        !linkstoBe.includes("temanovo_") &&
        !linkstoBe.includes("tema_") &&
        !linkstoBe.includes("modelos_linkstobe")
      )

      const now = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(now.getDate() - 7)

      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(now.getMonth() - 1)

      const metrics = validProjects.reduce(
        (acc, project) => {
          const createdAt = new Date(project.createdAt)

          acc.total += 1 

          if (createdAt >= sevenDaysAgo) {
            acc.inTheLastSevenDays += 1
          }

          if (createdAt >= oneMonthAgo) {
            acc.inTheLastMonth += 1
          }

          return acc
        },
        { total: 0, inTheLastSevenDays: 0, inTheLastMonth: 0 }
      )

      setProjectCreationMetrics(metrics)
    }

    getProjectCreationMetrics()
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
          value={projectCreationMetrics.inTheLastSevenDays}
        />
      </div>

      <EngagementCard 
        title="Links Criados nos últimos 30 dias"
        value={projectCreationMetrics.inTheLastMonth}
      />
    </div>
  )
}