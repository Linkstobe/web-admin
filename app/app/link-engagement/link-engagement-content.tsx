'use client'

import { IProject } from "@/interfaces/IProjects";
import AverageTimeOnPage from "./average-time-on-page";
import ClickThroughRate from "./click-through-rate";
import ClickedProjects from "./clicked-projects";
import EngagementFunnel from "./engagement-funnel";
import NewLinkSourceTable from "./new-link-source-table";
import ProjectEngagementCard from "./project-engagement-card";
import { use, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import CalendarDateRangePicker from "@/components/date-ranger-picker";
import { IMetric } from "@/interfaces/IMetrics";
import { IPainel } from "@/interfaces/IPanels";
import { IUser } from "@/interfaces/IUser";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";
import { PainelService } from "@/services/panel.service";
import { MetricsServices } from "@/services/metrics.service";

interface LinkEngagementContentProps {
  // projects: IProject[]
  // projectAccessMetrics: IMetric[]
  // panelsClicksMetrics: IMetric[]
  // panels: IPainel[]
  // users: IUser[]
}

export default function LinkEngagementContent ({
  // projects,
  // projectAccessMetrics,
  // panelsClicksMetrics,
  // panels,
  // users
}: LinkEngagementContentProps) {
  const [date, setDate] = useState<DateRange | undefined>()

  const [allProjects, setAllProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>()

  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const [allPanels, setAllPanels] = useState<IPainel[]>([])
  const [allAccessMetrics, setAllAccessMetrics] = useState<IMetric[]>([])

  const [allClicksMetrics, setAllClicksMetrics] = useState<IMetric[]>([])
  const [filteredPanelsClicksMetrics, setFilteredPanelsClicksMetrics] = useState<IMetric[]>(allClicksMetrics)

  const [filteredProjectsToSelect, setFilteredProjectsToSelect] = useState<IProject[]>(allProjects)
  const [selectedProject, setSelectedProject] = useState<number | null>(1);

  const [value, setValue] = useState<string>("ruancordel")

  const [currentPage, setCurrentPage] = useState<number>(1)
  const projectsPerPage: number = 8

  const paginatedProjects: IProject[] = filteredProjectsToSelect.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  )

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterProject = (value: string): void => {
    if (value.trim() === "") {
     setFilteredProjectsToSelect(allProjects) 
     return
    }

    const filteredData: IProject[] = allProjects.filter(({ linkstoBe }) => linkstoBe.includes(value))

    setFilteredProjectsToSelect(filteredData)
    setCurrentPage(1)
  }

  const onFilterMetrics = () => {
    let validsPanelsClicksMetrics: IMetric[] = allClicksMetrics
   
    if (selectedProject) {
      validsPanelsClicksMetrics = validsPanelsClicksMetrics.filter(
        ({ user_id }) => user_id === selectedProject
      )
    }

    if (date?.from) {
      const start = new Date(date.from)
      const end = date.to ? new Date(date.to) : new Date(date.from)
      end.setHours(23, 59, 59, 999)

      validsPanelsClicksMetrics = validsPanelsClicksMetrics.filter(({ createdAt }) => {
        const projectClicksMetricDate = new Date(createdAt)
        return projectClicksMetricDate >= start && projectClicksMetricDate <= end
      })
    }

    setFilteredPanelsClicksMetrics(validsPanelsClicksMetrics)
  }

  const onGetUsers = async () => {
    try {
      const users = await UserService.getAllUsers()
      setAllUsers(users)
    } catch (error) {
      console.log("LinkEngagementContent: ", error)
    }
  }

  const onGetPanels = async () => {
    try {
      const panels = await PainelService.onGetAllPanels()
      setAllPanels(panels)
    } catch (error) {
      console.log("LinkEngagementContent: ", error)
    }
  }

  const onGetProjects = async () => {
    try {
      const projects = await ProjectService.getAllProject()
      setAllProjects(projects)
      setFilteredProjects(projects)
      setFilteredProjectsToSelect(projects)
    } catch (error) {
      console.log("LinkEngagementContent: ", error)
    }
  }

  const onGetPanelClicksMetrics = async () => {
    try {
      const linkPanelClick = await MetricsServices.onGetAllMetricsByType("click:panel-link")
      const basicPanelClick = await MetricsServices.onGetAllMetricsByType("click:panel-basic")
      const advancedPanelClick = await MetricsServices.onGetAllMetricsByType("click:panel-advanced")

      const clicksMetrics = [...linkPanelClick, ...basicPanelClick, ...advancedPanelClick]

      setAllClicksMetrics(clicksMetrics)
      setFilteredPanelsClicksMetrics(clicksMetrics)
    } catch (error) {
      console.log("LinkEngagementContent: ", error)
    }
  }

  const onGetAccessMetrics = async () => {
    try {
      const accessMetrics = await MetricsServices.onGetAllMetricsByType("origin:")
      setAllAccessMetrics(accessMetrics)
    } catch (error) {
      console.log("LinkEngagementContent: ", error)
    }
  }

  useEffect(() => {
    onFilterMetrics()
  }, [date, selectedProject])

  useEffect(() => {
    onGetUsers()
    onGetPanels()
    onGetProjects()
    // onGetPanelClicksMetrics()
    onGetAccessMetrics()
  }, [])

  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Engajamento - projetos</h2>
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
                        count={Math.ceil(filteredProjects?.length / projectsPerPage)} 
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

      <ProjectEngagementCard
        projects={allProjects}
      />

      <div
        className="grid grid-cols-1 gap-4"
      >
        <div>
          <ClickedProjects 
            projectAccessMetrics={allAccessMetrics}
            projects={allProjects}
          />
        </div>

        {/* <div
          className="h-full"
        >
          <EngagementFunnel />
        </div> */}
      </div>

      <div
        className="grid grid-cols-2 gap-4"
      >
        {/* <div>
          <AverageTimeOnPage />
        </div> */}

        <div>
          {/* <ClickThroughRate 
            panelsClicksMetrics={filteredPanelsClicksMetrics}
            projects={allProjects}
            panels={allPanels}
          /> */}
        </div>
      </div>

      {/* <div>
        <NewLinkSourceTable 
          projects={allProjects}
          users={allUsers}
        />
      </div> */}
    </div>  
  )
} 