'use client'
import { DateRange } from "react-day-picker";
import PanelsClicksChart from "./panels-clicks-chart";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IProject } from "@/interfaces/IProjects";
import CalendarDateRangePicker from "@/components/date-ranger-picker";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { ProjectService } from "@/services/project.service";
import { IMetric } from "@/interfaces/IMetrics";
import { MetricsServices } from "@/services/metrics.service";

export default function Panels () {
  const [date, setDate] = useState<DateRange | undefined>()
  const [value, setValue] = useState<string>("ruancordel")

  const [allPanelsClicksMetrics, setAllPanelsClicksMetrics] = useState<IMetric[]>([])
  const [filteredPanelsClicksMetrics, setFilteredPanelsClicksMetrics] = useState<IMetric[]>([])

  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])

  const [selectedProjectId, setSelectedProjectId] = useState<number>(1)

  const [projectCurrentPage, setProjectCurrentPage] = useState<number>(1)
  const projectsPerPage: number = 8

  const paginatedProjects: IProject[] = filteredProjects.slice(
    (projectCurrentPage - 1) * projectsPerPage,
    projectCurrentPage * projectsPerPage,
  )

  const handlePageChange = (event: any, page: number): void => {
    setProjectCurrentPage(page)
  }

  const onFilterProject = (value: string): void => {
    if (value.trim() === "") {
     setFilteredProjects(allProjects) 
     return
    }

    const filteredData: IProject[] = allProjects.filter(({ linkstoBe }) => linkstoBe.includes(value))

    setFilteredProjects(filteredData)
    setProjectCurrentPage(1)
  }

  const onFilterMetrics = () => {
    if (date?.from) {
      const start = new Date(date.from)
      const end = date.to ? new Date(date.to) : new Date(date.from)
      end.setHours(23, 59, 59, 999)

      const validMetrics = allPanelsClicksMetrics.filter(({ createdAt }) => {
        const metricDate = new Date(createdAt)
        return metricDate >= start && metricDate <= end
      })

      setFilteredPanelsClicksMetrics(validMetrics)
    } else {
      setFilteredPanelsClicksMetrics(allPanelsClicksMetrics)
    }
  }

  useEffect(() => {
    onFilterMetrics()
  }, [date])

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projects = await ProjectService.getAllProject()
        setAllProjects(projects)
        setFilteredProjects(projects)
      } catch (error) {
        console.log("Panels: ", error)
      }
    }

    getProjects()
  }, [])

  useEffect(() => {
    const getPanelClicksMetrics = async () => {
      try {
        const linkPanelClicks = await MetricsServices.onGetAllMetricsByType("click:panel-link")
        const basicPanelClicks = await MetricsServices.onGetAllMetricsByType("click:panel-basic")
        const advancedPanelClicks = await MetricsServices.onGetAllMetricsByType("click:panel-advanced")

        const allClicksMetrics = [...linkPanelClicks, ...basicPanelClicks, ...advancedPanelClicks]
        
        setAllPanelsClicksMetrics(allClicksMetrics)
        setFilteredPanelsClicksMetrics(allClicksMetrics)
      } catch (error) {
        console.log("Panels: ", error)
      }
    }

    getPanelClicksMetrics()
  }, [])




  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Engajamento - Painéis</h2>

        <div
          className="flex gap-4 items-center"
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role=" "
                className="justify-between"
              >
                { value || "Selecione um projeto..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                            setSelectedProjectId(id)
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
                        count={Math.ceil(filteredProjects?.length / projectsPerPage)} 
                        page={projectCurrentPage}
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
        className="grid grid-cols-2 gap-4"
      >
        <div
          className="bg-white p-2 shadow-md rounded-lg"
        >

        </div>

        <div
          className="bg-white p-2 shadow-md rounded-lg"
        >
          <PanelsClicksChart 
            projectId={selectedProjectId}
            allPanelsClicksMetrics={filteredPanelsClicksMetrics}
          />
        </div>
      </div>

    </div>
  )
}