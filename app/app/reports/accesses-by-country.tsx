'use client'
import { Table } from "@/components/table"
import { IMetric } from "@/interfaces/IMetrics"
import { MetricsServices } from "@/services/metrics.service"
import { Pagination, Stack } from "@mui/material"
import { useEffect, useState } from "react"

export default function AccessesByCountry () {
  const [countryAccessMetrics, setCountryAccessMetrics] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const countriesPerPage = 15
  const offset = countriesPerPage * (currentPage - 1)

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const paginatedCountries = countryAccessMetrics.slice(
    (currentPage - 1) * countriesPerPage,
    currentPage * countriesPerPage
  )

  useEffect(() => {
    const getCountryMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const locationMetrics = allMetrics.filter(({ link_type }) => link_type.startsWith("location:"))
      
      const locationCount = locationMetrics.reduce((acc, { link_type }) => {
        const locationName = link_type.replace("location:", "")
        let [country] = locationName.split("-")
        
        country = country === "unknown" ? "Not found" : country
        
        if (country) {
          acc[country] = (acc[country] || 0) + 1
        }
        return acc
      }, {})

      const formattedMetrics = Object.entries(locationCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)

      setCountryAccessMetrics(formattedMetrics)
    }

    getCountryMetrics()
  }, [])

  return (
    <Table.Root
      className="shadow-none"
    >
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title=""/>
            <Table.HeaderItem title="País"/>
            <Table.HeaderItem title="Acessos"/>
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            paginatedCountries.map(({ name, value }, index) => (
              <Table.Row 
                key={index}
              >
                <Table.BodyItem text={`${index + 1 + offset}.`} />
                <Table.BodyItem text={name} />
                <Table.BodyItem text={`${value}`} />
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(countryAccessMetrics.length / countriesPerPage)} 
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