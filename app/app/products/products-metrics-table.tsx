'use client'
import { Table } from "@/components/table"
import { MetricsServices } from "@/services/metrics.service"
import { ProductService } from "@/services/product.service"
import { TransactionService } from "@/services/transactions.service"
import { Pagination, Stack } from "@mui/material"
import { useEffect, useState } from "react"

export default function ProductMetricsTable () {
  const [productsMetrics, setProductsMetrics] = useState([])
  const [filteredProductsMetrics, setFilteredProductsMetrics] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  const paginatedProducts = filteredProductsMetrics.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const onFilterProduct = (value: string) => {
    if (value.trim() === "") { 
      setFilteredProductsMetrics(productsMetrics) 
      return
    }

    const filteredData = productsMetrics.filter(item =>
      Object.values(item).some(
        field => String(field).toLowerCase().includes(value.trim().toLowerCase())
      )
    );

    setFilteredProductsMetrics(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getAllProducts = async () => {
      const allProducts = await ProductService.getAll()
      const allTransactions = await TransactionService.onGetAllTransactions()
      const allMetrics = await MetricsServices.onGetAllMetrics()

      const productsAccessesMetrics = allMetrics.filter(({ link_type }) => link_type.startsWith("view:product"))
      const productClicksMetrics = allMetrics.filter(({ link_type }) => (
        link_type.startsWith("click:panel-Carrossel") ||
        link_type.startsWith("click:panel-Carrossel-Imagens") ||
        link_type.startsWith("click:panel-Galeria") ||
        link_type.startsWith("click:panel-Bloco")
      ))

      const productsWithMetrics = allProducts.map(({ id, title }) => {
        const productMetrics = {
          name: title,
          totalAccesses: 0,
          totalClicks: 0,
          finisheds: 0,
          invoicing: 0,
        }

        productMetrics.totalAccesses = productsAccessesMetrics.reduce((total, { link_type }) => {
          return link_type === `view:product-${id}` ? total + 1 : total
        }, 0)

        productMetrics.totalClicks = productClicksMetrics.reduce((total, { link_type }) => {
          const productId = link_type.split("product-").pop()
          return Number(productId) === Number(id) ? total + 1 : total
        }, 0)

        productMetrics.finisheds = allTransactions.reduce((total, { productId }) => {
          return Number(productId) === Number(id) ? total + 1 : total
        }, 0)

        productMetrics.invoicing = allTransactions.reduce((total, { productId, amount }) => {
          return Number(productId) === Number(id) ? total + (Number(amount) / 100) : total
        }, 0)

        return productMetrics
      }).sort((a, b) => b.invoicing - a.invoicing)

      setProductsMetrics(productsWithMetrics)
      setFilteredProductsMetrics(productsWithMetrics)
    }

    getAllProducts()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Produtos"
        />

        <Table.Search
          placeholder="Buscar"
          onChange={onFilterProduct}
        />
      </Table.TopSection>
      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome" />
            <Table.HeaderItem title="Total de acessos" />
            <Table.HeaderItem title="Total de cliques" />
            <Table.HeaderItem title="Finalizados" />
            <Table.HeaderItem title="Faturamento" />
          </Table.Row>
        </Table.HeaderSection>
        <Table.BodySection>
          {
            paginatedProducts.map(({ name, totalAccesses, totalClicks, finisheds, invoicing }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem className="truncate max-w-32" text={name} explanation={name} />
                <Table.BodyItem className="truncate max-w-32" text={totalAccesses} explanation={totalAccesses} />
                <Table.BodyItem className="truncate max-w-20" text={totalClicks} explanation={totalClicks} />
                <Table.BodyItem className="truncate capitalize max-w-20" text={finisheds} explanation={finisheds} />
                <Table.BodyItem className="truncate capitalize max-w-20" text={invoicing} explanation={invoicing} />
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>
      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(filteredProductsMetrics.length / productsPerPage)} 
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