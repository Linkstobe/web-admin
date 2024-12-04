'use client'

import { IMetric } from "@/interfaces/IMetrics";
import FormMetricsCards from "./form-metrics-cards";
import FormMetricsTable from "./form-metrics-table";
import { IForm } from "@/interfaces/IForms";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import CalendarDateRangePicker from "@/components/date-ranger-picker";
import { IProject } from "@/interfaces/IProjects";
import { cn } from "@/lib/utils";

interface FormsContentProps {
  formAccessMetrics: IMetric[]
  formClicksMetrics: IMetric[]
  forms: IForm[]
  projects: IProject[]
}

export default function FormsContent ({
  formAccessMetrics,
  formClicksMetrics,
  forms,
  projects
}: FormsContentProps) {

  const [date, setDate] = useState<DateRange | undefined>()

  const [filteredFormAccessMetrics, setFilteredFormAccessMetrics] = useState<IMetric[]>(formAccessMetrics)
  const [filteredFormClicksMetrics, setFilteredFormClicksMetrics] = useState<IMetric[]>(formClicksMetrics)
  const [filteredForms, setFilteredForms] = useState<IForm[]>(forms)

  const [filteredProjects, setFilteredProjects] = useState<IProject[]>(projects)
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

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
    let validFormsAccessMetrics = formAccessMetrics
    let validFormsClicksMetrics = formClicksMetrics
    let validForms = forms

    if (selectedProject) {
      validFormsAccessMetrics = validFormsAccessMetrics.filter(
        ({ user_id }) => user_id === selectedProject
      )
      validFormsClicksMetrics = validFormsClicksMetrics.filter(
        ({ user_id }) => user_id === selectedProject
      )
      validForms = validForms.filter(
        ({ project_id }) => project_id === selectedProject
      )
    }

    if (date?.from) {
      const start = new Date(date.from)
      const end = date.to ? new Date(date.to) : new Date(date.from)
      end.setHours(23, 59, 59, 999)

      validForms = validForms.filter(({ createdAt }) => {
        const formDate = new Date(createdAt)
        return formDate >= start && formDate <= end
      })

      validFormsAccessMetrics = validFormsAccessMetrics.filter(({ createdAt }) => {
        const formAccessMetricDate = new Date(createdAt)
        return formAccessMetricDate >= start && formAccessMetricDate <= end
      })

      validFormsClicksMetrics = validFormsClicksMetrics.filter(({ createdAt }) => {
        const formClicksMetricDate = new Date(createdAt)
        return formClicksMetricDate >= start && formClicksMetricDate <= end
      })
    }

    setFilteredFormAccessMetrics(validFormsAccessMetrics)
    setFilteredFormClicksMetrics(validFormsClicksMetrics)
    setFilteredForms(validForms)
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
                      paginatedProjects.map(({ id, linkstoBe }, index) => (
                        <CommandItem
                          key={index}
                          value={linkstoBe}
                          onSelect={(currentValue) => {
                            setValue(currentValue)
                            if (selectedProject === id) {
                              setSelectedProject(null)
                              setValue("")
                              return
                            }
                            setSelectedProject(id)
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
          Métricas de formulários
        </h4>
        <FormMetricsCards
          formAccessMetrics={filteredFormAccessMetrics}
          formClicksMetrics={filteredFormClicksMetrics}
          forms={filteredForms}
        />
      </div>
      
      <div>
        <FormMetricsTable 
          formAccessMetrics={filteredFormAccessMetrics}
          formClicksMetrics={filteredFormClicksMetrics}
          forms={filteredForms}
        />
      </div>
    </div>
  )
}