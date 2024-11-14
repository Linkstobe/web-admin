'use client'
import { Table } from "@/components/table"
import { IForm } from "@/interfaces/IForms"
import { IMetric } from "@/interfaces/IMetrics"
import { FormService } from "@/services/form.service"
import { MetricsServices } from "@/services/metrics.service"
import { Pagination, Stack } from "@mui/material"
import { useEffect, useState } from "react"

type TableFormMetric = {
  name: string
  totalAccesses: number
  totalClicks: number
  registers: number
  engagement: number
}

export default function FormMetricsTable () {
  const [formMetrics, setFormMetrics] = useState<TableFormMetric[]>([])
  const [filteredFormMetrics, setFilteredFormMetrics] = useState<TableFormMetric[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const formsPerPage: number = 10

  const  paginatedForms: TableFormMetric[] = filteredFormMetrics.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage,
  )

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterForm = (value: string): void => {
    if (value.trim() === "") {
     setFilteredFormMetrics(formMetrics) 
     return
    }

    const filteredData: TableFormMetric[] = formMetrics.filter(item =>
      Object.values(item).some(
        field => String(field).toLowerCase().includes(value.trim().toLowerCase())
      )
    )

    setFilteredFormMetrics(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getAllFormMetrics = async () => {
      const allMetrics: IMetric[] = await MetricsServices.onGetAllMetrics()
      const allForms: IForm[] = await FormService.getAllForms()

      const formAccessesMetrics: IMetric[] = allMetrics.filter(({ link_type }) => link_type.startsWith("view:form"))
      const formClicksMetrics: IMetric[] = allMetrics.filter(({ link_type }) => link_type.startsWith("click:panel-Modelo padrão"))

      const formWithMetrics: TableFormMetric[] = allForms.map(({ id, form_name: name, responses, project_id }) => {
        const totalClicks: number = formClicksMetrics.reduce((count, { link_type }) => {
          const formId = link_type.split("-")[3]
          return Number(formId) === Number(id) ? count + 1 : count
        }, 0)

        const totalAccesses: number = formAccessesMetrics.reduce((count, { link_type }) => {
          const idForm = link_type.split("-")[1]
          return Number(idForm) === Number(id) ? count + 1 : count
        }, 0)

        const registers: number = responses.length
        const engagement: number = parseFloat((totalAccesses > 0 ? (registers / totalAccesses) * 100 : 0).toFixed(2))

        return {
          name,
          registers,
          totalClicks,
          totalAccesses,
          engagement
        }
      })

      setFilteredFormMetrics(formWithMetrics)
      setFormMetrics(formWithMetrics)
    }

    getAllFormMetrics()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Formulários"
        />

        <Table.Search
          placeholder="Buscar"
          onChange={onFilterForm}
        />
      </Table.TopSection>
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome" />
            <Table.HeaderItem title="Total de acessos" />
            <Table.HeaderItem title="Total de cliques" />
            <Table.HeaderItem title="Cadastros" />
            <Table.HeaderItem title="Engajamento" />
          </Table.Row>
        </Table.HeaderSection>
        <Table.BodySection>
          {
            paginatedForms.map(({ name, totalAccesses, totalClicks, registers, engagement }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem className="truncate max-w-32" text={name} explanation={name} />
                <Table.BodyItem className="truncate max-w-32" text={`${totalAccesses}`} explanation={`${totalAccesses}`} />
                <Table.BodyItem className="truncate max-w-32" text={`${totalClicks}`} explanation={`${totalClicks}`} />
                <Table.BodyItem className="truncate max-w-32" text={`${registers}`} explanation={`${registers}`} />
                <Table.BodyItem className="truncate max-w-32" text={`${engagement}%`} explanation={`${engagement}%`} />
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(filteredFormMetrics.length / formsPerPage)} 
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