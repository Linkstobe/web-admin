'use client'
import CalendarDateRangePicker from "@/components/date-ranger-picker"
import { Table } from "@/components/table"
import { catchError, formatDateToSequelize } from "@/lib/utils"
import { PainelService } from "@/services/panel.service"
import { Pagination, Stack } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PanelMetricsTable () {
  const [panelMetrics, setPanelMetrics] = useState([]);
  const [date, setDate] = useState({
    from: new Date(Date.now() - 368 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [filteredPanelMetrics, setFilteredPanelMetrics] = useState(undefined)

  const dateChangeAction = async (event: {from: Date, to: Date }) => {
    setDate(event);
    getPanelMetrics();
  }

  const [currentPage, setCurrentPage] = useState(1)
  const panelsPerPage = 10

  const paginatedPanels = filteredPanelMetrics?.slice(
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

  const getPanelMetrics = async () => {
    const [err, metrics] = await catchError(PainelService.getPainelsMetrics({ 
      startDate: formatDateToSequelize(date.from),
      endDate: formatDateToSequelize(date.to)
    }));
    if (err) console.error(err);
    setPanelMetrics(metrics);
    setFilteredPanelMetrics(metrics);
  }

  useEffect(() => {
    getPanelMetrics()
  }, [])

  return (
    <Table.Root className={!paginatedPanels && "animate-pulse"}>
      <Table.TopSection>
        
          <Table.Title 
            title="Painéis"
          />

        <div className="flex items-center gap-4 justify-end w-full pl-4">
          <Table.Search
            placeholder="Buscar"
            onChange={onFilterPanel}
          />
          <CalendarDateRangePicker
            date={date}
            setDate={dateChangeAction}
          />
        </div>
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
            paginatedPanels?.map(({ title, url, clicks, type, project }, index) => (
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
              count={Math.ceil(filteredPanelMetrics?.length / panelsPerPage)} 
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