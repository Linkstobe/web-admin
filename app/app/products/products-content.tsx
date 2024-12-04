'use client'

import ProductsMetricsCards from "./products-metrics-cards"
import ProductMetricsTable from "./products-metrics-table"
import { ITransaction } from "@/interfaces/ITransactions"
import { IProduct } from "@/interfaces/IProducts"
import { IMetric } from "@/interfaces/IMetrics"
import { IProject } from "@/interfaces/IProjects"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import CalendarDateRangePicker from "@/components/date-ranger-picker"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

interface ProductsContentProps {
  products: IProduct[]
  transactions: ITransaction[]
  productAccessMetrics: IMetric[]
  productClicksMetrics: IMetric[]
  projects: IProject[]
}

export default function ProductsContent ({
  products,
  transactions,
  productAccessMetrics,
  productClicksMetrics,
  projects
}: ProductsContentProps) {
  const [date, setDate] = useState<DateRange | undefined>()

  const [filteredProductAccessMetrics, setFilteredProductAccessMetrics] = useState<IMetric[]>(productAccessMetrics)
  const [filteredProductClicksMetrics, setFilteredProductClicksMetrics] = useState<IMetric[]>(productClicksMetrics)
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>(products)
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>(transactions)

  const [filteredProjects, setFilteredProjects] = useState<IProject[]>(projects)
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const [value, setValue] = useState<string>("")

  const [currentPage, setCurrentPage] = useState<number>(1)
  const projectsPerPage: number = 8

  const paginatedProjects: IProject[] = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  )

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterProject = (value: string): void => {
    if (value.trim() === "") {
     setFilteredProjects(projects) 
     return
    }

    const filteredData: IProject[] = projects.filter(({ linkstoBe }) => linkstoBe.includes(value))

    setFilteredProjects(filteredData)
    setCurrentPage(1)
  }

  const onFilterMetrics = () => {
    let validsProductAccessMetrics: IMetric[] = productAccessMetrics
    let validsProductClicksMetrics: IMetric[] = productClicksMetrics
    let validsProducts: IProduct[] = products
    let validsTransactions: ITransaction[] = transactions

    if (selectedProject) {
      validsProductAccessMetrics = validsProductAccessMetrics.filter(
        ({ user_id }) => user_id === selectedProject
      )
      validsProductClicksMetrics = validsProductClicksMetrics.filter(
        ({ user_id }) => user_id === selectedProject
      )
      validsProducts = validsProducts.filter(
        ({ user_id }) =>  user_id === selectedUser
      )
      validsTransactions = validsTransactions.filter(
        ({ seller_id }) => Number(seller_id) === Number(selectedUser)  
      )
    }

    if (date?.from) {
      const start = new Date(date.from)
      const end = date.to ? new Date(date.to) : new Date(date.from)
      end.setHours(23, 59, 59, 999)

      validsProductAccessMetrics = validsProductAccessMetrics.filter(({ createdAt }) => {
        const productAccessMetricDate = new Date(createdAt)
        return productAccessMetricDate >= start && productAccessMetricDate <= end
      })

      validsProductClicksMetrics = validsProductClicksMetrics.filter(({ createdAt }) => {
        const productClicksMetricDate = new Date(createdAt)
        return productClicksMetricDate >= start && productClicksMetricDate <= end
      })

      validsProducts = validsProducts.filter(({ createdAt }) => {
        const productDate = new Date(createdAt)
        return productDate >= start && productDate <= end
      })

      validsTransactions = validsTransactions.filter(({ createdAt }) => {
        const transactionDate = new Date(createdAt)
        return transactionDate >= start && transactionDate <= end
      })
    }

    setFilteredProductAccessMetrics(validsProductAccessMetrics)
    setFilteredProductClicksMetrics(validsProductClicksMetrics)
    setFilteredProducts(validsProducts)
    setFilteredTransactions(validsTransactions)
  }

  useEffect(() => {
    onFilterMetrics()
  }, [date, selectedProject])

  return (
    <div
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Formulários</h2>
        <div
          className="flex gap-4 items-center"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between"
              >
                { value || "Selecione um projeto..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <Command>
                <CommandInput 
                  placeholder="Pesquise por projeto..." 
                  onInput={e => onFilterProject((e.target as HTMLInputElement).value)}
                />
                <CommandList>
                  <CommandEmpty>Projeto não encontrado</CommandEmpty>
                  <CommandGroup>
                    {
                      paginatedProjects.map(({ id, linkstoBe, user_id }, index) => (
                        <CommandItem
                          key={index}
                          value={linkstoBe}
                          onSelect={(currentValue) => {
                            setValue(currentValue)
                            if (selectedProject === id) {
                              setSelectedProject(null)
                              setSelectedUser(null)
                              setValue("")
                              return
                            }
                            setSelectedProject(id)
                            setSelectedUser(user_id)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === linkstoBe ? "opacity-100" : "opacity-0"
                            )}
                          />
                          { linkstoBe }
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>
                  <div
                    className="flex justify-end"
                  >
                    <Stack>
                      <Pagination 
                        count={Math.ceil(filteredProjects.length / projectsPerPage)} 
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined" 
                        shape="rounded"
                        renderItem={(item) => {
                          if (item.type === 'previous' || item.type === 'next') {
                            return (
                              <PaginationItem
                                {...item}
                              />
                            )
                          }
                          return null
                        }} 
                      />
                    </Stack>
                  </div>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <CalendarDateRangePicker
            date={date} 
            setDate={setDate}
          />
        </div>
      </div>

      <div
        className="flex flex-col gap-4"
      >
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de produtos
        </h4>

        <ProductsMetricsCards 
          productAccessMetrics={filteredProductAccessMetrics}
          productClicksMetrics={filteredProductClicksMetrics}
          transactions={filteredTransactions}
        />
      </div>

      <div>
        <ProductMetricsTable 
          productAccessMetrics={filteredProductAccessMetrics}
          productClicksMetrics={filteredProductClicksMetrics}
          products={filteredProducts}
          transactions={filteredTransactions}
        />
      </div>
    </div>
  )
}