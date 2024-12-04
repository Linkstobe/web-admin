'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { IMetric } from "@/interfaces/IMetrics";
import { MetricsServices } from "@/services/metrics.service";
import { Computer, MousePointerClick, Percent, User } from "lucide-react";
import { useEffect, useState } from "react";

type ProjectMetrics = {
  uniqueAccesses: number
  totalAccesses: number
  totalClicks: number
  engagementRate: number
}

interface ProjectsMetricsCardsProps {
  accessesMetrics: IMetric[]
  clicksMetrics: IMetric[]
}

export default function ProjectsMetricsCards ({
  accessesMetrics,
  clicksMetrics
}: ProjectsMetricsCardsProps) {
  const [projectsMetrics, setProjectsMetrics] = useState<ProjectMetrics>({
    uniqueAccesses: 0,
    totalAccesses: 0,
    totalClicks: 0,
    engagementRate: 0,
  })

  useEffect(() => {
    const getAllAccessesMetrics = () => {

      if (!accessesMetrics || !clicksMetrics) return

      const uniqueIps = new Set()
      let uniqueAccessCount = 0

      accessesMetrics.forEach(({ ip }) => {
        if (!uniqueIps.has(ip)) {
          uniqueIps.add(ip)
          uniqueAccessCount += 1
        }
      })

      const totalAccesses = accessesMetrics.length
      const totalClicks = clicksMetrics.length

      setProjectsMetrics(prev => ({
        ...prev,
        uniqueAccesses: uniqueAccessCount,
        totalAccesses,  
        totalClicks,
        engagementRate: totalAccesses !== 0 ? parseFloat(((totalClicks / totalAccesses) * 100).toFixed(2)) : 0,
      }))
    }

    getAllAccessesMetrics()
  }, [accessesMetrics, clicksMetrics])

  return (
    <div
      className="grid grid-cols-4 gap-4 bg-white rounded-lg shadow-lg p-4"
    >
      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Acessos únicos"
            />

            <AnalyticsSimpleCard.Icon
              icon={Computer}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={projectsMetrics.uniqueAccesses}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Acesso total"
            />

            <AnalyticsSimpleCard.Icon
              icon={User}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value
              value={projectsMetrics.totalAccesses}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Cliques"
            />

            <AnalyticsSimpleCard.Icon
              icon={MousePointerClick}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={projectsMetrics.totalClicks}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Taxa de engajamento"
            />

            <AnalyticsSimpleCard.Icon
              icon={Percent}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={projectsMetrics.engagementRate}
              type="percent"
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>
    </div>
  )
}