'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { IForm } from "@/interfaces/IForms";
import { IMetric } from "@/interfaces/IMetrics";
import { FormService } from "@/services/form.service";
import { MetricsServices } from "@/services/metrics.service";
import { Computer, MousePointerClick, Percent, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface FormMetricsCardsProps {
  formAccessMetrics: IMetric[]
  formClicksMetrics: IMetric[]
  forms: IForm[]
}

type FormMetrics = {
  totalAccessMetrics: number
  clicks: number
  engagementRate: number
  registers: number
}

export default function FormMetricsCards ({
  formAccessMetrics,
  formClicksMetrics,
  forms
}: FormMetricsCardsProps) {
  const [formMetrics, setFormMetrics] = useState<FormMetrics>({
    totalAccessMetrics: 0,
    clicks: 0,
    engagementRate: 0,
    registers: 0
  })

  useEffect(() => {
    const getFormMetrics = async () => {
      if (!formAccessMetrics || !formAccessMetrics || !forms) return

      const allFormRegisters = forms.reduce((acc, form) => acc + form.responses.length, 0)

      const uniqueIps = new Set()
      let uniqueAccessCount = 0

      formAccessMetrics.forEach(({ ip }) => {
        if (!uniqueIps.has(ip)) {
          uniqueIps.add(ip)
          uniqueAccessCount += 1
        }
      })

      setFormMetrics(prevMetrics => ({
        ...prevMetrics,
        totalAccessMetrics: formAccessMetrics.length,
        clicks: formClicksMetrics.length,
        registers: allFormRegisters,
        engagementRate: uniqueAccessCount === 0 ? 0 : parseFloat(((allFormRegisters / formAccessMetrics.length) * 100).toFixed(2))
      }))
    }

    getFormMetrics()
  }, [formAccessMetrics, formClicksMetrics, forms])


  return (
    <div
      className="grid grid-cols-4 gap-4 bg-white rounded-lg shadow-lg p-4"
    >
      <AnalyticsSimpleCard.Root>
        <AnalyticsSimpleCard.Content>
          <AnalyticsSimpleCard.TopSection>
            <AnalyticsSimpleCard.Title 
              title="Acessos Totais"
            />

            <AnalyticsSimpleCard.Icon
              icon={Computer}
            />
          </AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.BodySection>
            <AnalyticsSimpleCard.Value 
              value={formMetrics.totalAccessMetrics}
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