'use client'
import { Table } from "@/components/table";
import { IMetric } from "@/interfaces/IMetrics";
import { MetricsServices } from "@/services/metrics.service";
import { useEffect, useState } from "react";

export default function AccessesToSocialMedia () {
  const [socialMediaAccessMetrics, setSocialMediaAccessMetrics] = useState([])

  useEffect(() => {
    const getSocialMediaMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const socialMediaMetrics = allMetrics.filter(({ link_type }) => link_type.startsWith("access:"))
      
      const metricsCount = socialMediaMetrics.reduce((acc, { link_type }) => {
        const name = link_type.replace("access:", "")
        acc[name] = (acc[name] || 0) + 1
        return acc
      }, {})

      const formattedMetrics = Object.keys(metricsCount)
      .map((name) => ({
        name,
        value: metricsCount[name]
      }))
      .sort((a, b) => b.value - a.value)

      setSocialMediaAccessMetrics(formattedMetrics)
    }

    getSocialMediaMetrics()
  }, [])

  return (
    <Table.Root
      className="shadow-none"
    >
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Links" />
            <Table.HeaderItem title="Acessos" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            socialMediaAccessMetrics.map(({ name, value }, index) => (
              <Table.Row key={index}>
                <Table.BodyItem text={name} className="capitalize" />
                <Table.BodyItem text={`${value}`} />
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
    </Table.Root>
  )
}