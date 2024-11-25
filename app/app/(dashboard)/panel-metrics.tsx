'use client'
import { Table } from "@/components/table"
import { MetricsServices } from "@/services/metrics.service"
import { PainelService } from "@/services/panel.service"
import { ProjectService } from "@/services/project.service"
import { Pagination, Stack } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PanelMetricsTable () {
  const [panelMetrics, setPanelMetrics] = useState([])
  const [filteredPanelMetrics, setFilteredPanelMetrics] = useState([])
  
  const [currentPage, setCurrentPage] = useState(1)
  const panelsPerPage = 10

  const paginatedPanels = filteredPanelMetrics.slice(
    (currentPage - 1) * panelsPerPage,
    currentPage * panelsPerPage
  )

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const onFilterPanel = (value: string) => {    
    if (value.trim() === "") { 
      setFilteredPanelMetrics(panelMetrics) 
      return
    }

    const filteredData = panelMetrics.filter(item =>
      Object.values(item).some(
        field => typeof field === 'string' && field.toLowerCase().includes(value.trim().toLowerCase())
      )
    );

    setFilteredPanelMetrics(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getPanelMetrics = async () => {
      try {
        const allMetrics = await MetricsServices.onGetAllMetrics()
        const panelMetrics = allMetrics.filter(({ link_type }) => 
          link_type.startsWith("click:panel-link") || 
          link_type.startsWith("click:panel-basic") || 
          link_type.startsWith("click:panel-advanced")
        )

        const allPanels = await PainelService.onGetAllPanels()
        const validPanels = allPanels.filter(({ painel_style }) => 
          painel_style === "link" ||
          painel_style === "basic" ||
          painel_style === "advanced"
        )

        const allProjects = await ProjectService.getAllProject()

        const panelData = validPanels.map((panel) => {
          const panelId = panel.id
          const clicks = panelMetrics.reduce((count, metric) => {
            const metricId = metric.link_type.split('-').pop()
            return Number(metricId) === Number(panelId) ? count + 1 : count
          }, 0)

          const projectMatch = allProjects.find(
            (project: any) => project.id === panel.project_id
          )

          return {
            title: panel.painel_title || "sem título",
            url: panel.painelUrl || "sem url",
            type: panel.painel_style,
            clicks: clicks,
            project: projectMatch.linkstoBe
          }
        }).sort((a, b) => b.clicks - a.clicks)

        setPanelMetrics(panelData)
        setFilteredPanelMetrics(panelData)

      } catch (error) {
        console.log(error)
      }
    }

    getPanelMetrics()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Painéis"
        />

        <Table.Search
          placeholder="Buscar"
          onChange={onFilterPanel}
        />
      </Table.TopSection>
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Título do painel" />
            <Table.HeaderItem title="Url" />
            <Table.HeaderItem title="Total de cliques" />
            <Table.HeaderItem title="Tipo do painel" />
            <Table.HeaderItem title="Projeto" />
          </Table.Row>
        </Table.HeaderSection>
        <Table.BodySection>
          {
            paginatedPanels.map(({ title, url, clicks, type, project }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem className="truncate max-w-32" text={title} explanation={title} />
                <Table.BodyItem className="truncate max-w-32" text={url} explanation={url} />
                <Table.BodyItem className="truncate max-w-20" text={clicks} explanation={clicks} />
                <Table.BodyItem className="truncate capitalize max-w-20" text={type} explanation={type} />
                <Table.BodyItem>
                  <Link
                    href={"https://linksto.be/" + project}
                    target="_blank"
                    className="underline text-[#164F62] font-semibold"
                  >
                    { project }
                  </Link>
                </Table.BodyItem>
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(filteredPanelMetrics.length / panelsPerPage)} 
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined" 
              shape="rounded" 
            />
          </Stack>
        </div>
      </Table.Footer>
    </Table.Root>
  )
}