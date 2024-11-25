'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { FormService } from "@/services/form.service";
import { MetricsServices } from "@/services/metrics.service";
import { Computer, MousePointerClick, Percent, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

type FormMetrics = {
  uniqueAccesses: number
  clicks: number
  engagementRate: number
  registers: number
}

export default function FormMetricsCards () {
  const [formMetrics, setFormMetrics] = useState<FormMetrics>({
    uniqueAccesses: 0,
    clicks: 0,
    engagementRate: 0,
    registers: 0
  })

  useEffect(() => {
    const getFormMetrics = async () => {
      const allMetrcics = await MetricsServices.onGetAllMetrics()
      const allForms = await FormService.getAllForms()

      const allFormAccess = allMetrcics.filter(({ link_type }) => link_type.startsWith("view:form"))
      const allFormClicks = allMetrcics.filter(({ link_type }) => link_type.startsWith("click:panel-Modelo padrão-"))
      const allFormRegisters = allForms.reduce((acc, form) => acc + form.responses.length, 0)

      const uniqueIps = new Set()
      let uniqueAccessCount = 0

      allFormAccess.forEach(({ ip }) => {
        if (!uniqueIps.has(ip)) {
          uniqueIps.add(ip)
          uniqueAccessCount += 1
        }
      })

      setFormMetrics(prevMetrics => ({
        ...prevMetrics,
        uniqueAccesses: uniqueAccessCount,
        clicks: allFormClicks.length,
        registers: allFormRegisters,
        engagementRate: parseFloat(((allFormRegisters / uniqueAccessCount) * 100).toFixed(2))
      }))
    }

    getFormMetrics()
  },[])


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
              value={formMetrics.uniqueAccesses}
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
              value={formMetrics.clicks}
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>

      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Cadastros"
            />

            <AnalyticsSimpleCard.Icon
              icon={UserPlus}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={formMetrics.registers}
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
              value={formMetrics.engagementRate}
              type="percent"
            />
          </AnalyticsSimpleCard.BodySection>
        </AnalyticsSimpleCard.Content>
      </AnalyticsSimpleCard.Root>
    </div>
  )
}