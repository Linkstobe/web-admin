'use client'

import { Separator } from "@/components/ui/separator"
import { IMetric } from "@/interfaces/IMetrics"
import { MetricsServices } from "@/services/metrics.service"
import { useEffect, useState } from "react"
import ProjectsMetricsCards from "../(dashboard)/projects-metrics-cards"
import AccessesPerDay from "./accesses-per-day"
import AccessesPerHour from "./accesses-per-hour"
import AccessesByOperatingSystem from "./accesses-by-operating-system"
import AccessesToSocialMedia from "./accesses-to-social-media"
import AccessesByState from "./accesses-by-state"
import AccessesByCountry from "./accesses-by-country"
import CalendarDateRangePicker from "@/components/date-ranger-picker"
import { DateRange } from "react-day-picker"
import { IProject } from "@/interfaces/IProjects"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, DollarSign, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ProjectService } from "@/services/project.service"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import LineChart from "@/components/line-chart"
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card"
import ProjectRevenueMetric from "./project-revenue-metric"
import NewProjectsMetric from "./new-projects-metric"
import NewLinkSourceTable from "../link-engagement/new-link-source-table"
import { IUser } from "@/interfaces/IUser"
import { UserService } from "@/services/user.service"

export default function ReportContent () {
  const [allMetrics, setAllMetrics] = useState<IMetric[]>([])
  const [filteredMetrics, setFilteredMetrics] = useState<IMetric[]>([])
  const [date, setDate] = useState<DateRange | undefined>()

  const [accessesMetrics, setAccessesMetrics] = useState<IMetric[]>()
  const [allAccessesMetrics, setAllAccessesMetrics] = useState<IMetric[]>()

  const [clicksMetrics, setClicksMetrics] = useState<IMetric[]>()
  const [allClicksMetrics, setAllClicksMetrics] = useState<IMetric[]>()

  const [socialMediaAccessesMetrics, setSocialMediaAccessesMetrics] = useState<IMetric[]>()
  const [allSocialMediaAccessesMetrics, setAllSocialMediaAccessesMetrics] = useState<IMetric[]>()

  const [locationMetrics, setLocationMetrics] = useState<IMetric[]>()
  const [allLocationMetrics, setAllLocationMetrics] = useState<IMetric[]>()

  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [allNewProjects, setAllNewProjects] = useState<IProject[]>([])
  const [filteredAllNewProjects, setFilteredAllNewProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const [value, setValue] = useState<string>("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | number>("all")

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
     setFilteredProjects(allProjects) 
     return
    }

    const filteredData: IProject[] = allProjects.filter(({ linkstoBe }) => linkstoBe.includes(value))

    setFilteredProjects(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getAllMetrics = async () => {
      try {
        const [accesses, clicks, socialMediaAccesses, locations] = await Promise.all([
          MetricsServices.onGetAllMetricsByType("origin:"),
          MetricsServices.onGetAllMetricsByType("click:"),
          MetricsServices.onGetAllMetricsByType("access:"),
          MetricsServices.onGetAllMetricsByType("location:")
        ]);

        setAccessesMetrics(accesses)
        setAllAccessesMetrics(accesses)

        setClicksMetrics(clicks)
        setAllClicksMetrics(clicks)

        setSocialMediaAccessesMetrics(socialMediaAccesses)
        setAllSocialMediaAccessesMetrics(socialMediaAccesses)

        setLocationMetrics(locations)
        setAllLocationMetrics(locations)
      } catch (error) {
        console.log("ReportContent: ", error)
      }
    }

    getAllMetrics()
  }, [])

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const projects = await ProjectService.getAllProject()
        setAllProjects(projects)
        setFilteredProjects(projects)
        setAllNewProjects(projects)
        setFilteredAllNewProjects(projects)
      } catch (error) {
        console.log("ReportContent: ", error)
      }
    }

    const getAllUsers = async () => {
      try {
        const users = await UserService.getAllUsers()
        setAllUsers(users)
      } catch (error) {
        console.log("ReportContent: ", error)
      }
    }

    getAllProjects()
    getAllUsers()
  }, [])

  useEffect(() => {
    const onFilterMetrics = () => {
      let accesses = [...(allAccessesMetrics || [])]
      let clicks = [...(allClicksMetrics || [])]
      let socialMediaAccesses = [...(allSocialMediaAccessesMetrics || [])]
      let locations = [...(allLocationMetrics || [])]
      
      let newProjects = [...(allNewProjects) || []]

      // Filtro por projeto
      if (selectedProject) {
        accesses = accesses.filter((metric) => Number(metric.user_id) === Number(selectedProject))
        clicks = clicks.filter((metric) => Number(metric.user_id) === Number(selectedProject))
        socialMediaAccesses = socialMediaAccesses.filter((metric) => Number(metric.user_id) === Number(selectedProject))
        locations = locations.filter((metric) => Number(metric.user_id) === Number(selectedProject))
      }

      // Filtro por data
      if (date?.from) {
        const start = new Date(date.from)
        const end = date.to ? new Date(date.to) : new Date(date.from)
        end.setHours(23, 59, 59, 999)

        accesses = accesses.filter((metric) => {
          const metricDate = new Date(metric.createdAt)
          return metricDate >= start && metricDate <= end
        })
        clicks = clicks.filter((metric) => {
          const metricDate = new Date(metric.createdAt)
          return metricDate >= start && metricDate <= end
        })
        socialMediaAccesses = socialMediaAccesses.filter((metric) => {
          const metricDate = new Date(metric.createdAt)
          return metricDate >= start && metricDate <= end
        })
        locations = locations.filter((metric) => {
          const metricDate = new Date(metric.createdAt)
          return metricDate >= start && metricDate <= end
        })

        newProjects = newProjects.filter((project) => {
          const projectDate = new Date(project.createdAt)
          return projectDate >= start && projectDate <= end
        })
      }

      // Atualiza os estados filtrados
      setAccessesMetrics(accesses)
      setFilteredAllNewProjects(newProjects)
      setClicksMetrics(clicks)
      setSocialMediaAccessesMetrics(socialMediaAccesses)
      setLocationMetrics(locations)
    }

    onFilterMetrics()
  }, [date, selectedProject, allAccessesMetrics, allClicksMetrics, allSocialMediaAccessesMetrics, allLocationMetrics])

  return (
    <div
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
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
                {value || "Selecione um projeto..."}
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
                    <CommandItem
                      value="Todos"
                      onSelect={(currentValue) => {
                        setSelectedProject(null)
                        setValue("")
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProject === null ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Todos
                    </CommandItem>
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
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de projetos
        </h4>
        
        <ProjectsMetricsCards
          accessesMetrics={accessesMetrics}
          clicksMetrics={clicksMetrics}
        />
      </div>

      <AccessesPerDay 
        accessMetrics={accessesMetrics}
        clicksMetrics={clicksMetrics}
        dateRange={date}
      />

      
      <AccessesPerHour 
        clicksMetrics={clicksMetrics}
        accessMetrics={accessesMetrics}
      />

      <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByOperatingSystem 
          accessMetrics={accessesMetrics}
        />

        <AccessesToSocialMedia 
          socialMediaAccessesMetrics={socialMediaAccessesMetrics}
        />
      </div> 

      <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByState
          locationMetrics={locationMetrics}
        />

        <AccessesByCountry 
          locationMetrics={locationMetrics}
        />
      </div>

      <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <NewProjectsMetric 
          selectedProject={selectedProject}
          projects={filteredAllNewProjects}
        />
        
        <ProjectRevenueMetric 
          projects={filteredAllNewProjects}
          selectedProject={selectedProject}
        />
      </div>

      <div>
        <NewLinkSourceTable
          allProjects={allProjects}
          projects={filteredAllNewProjects}
          users={allUsers}
          selectedProject={selectedProject}
        />
      </div>
    </div>
  )
}