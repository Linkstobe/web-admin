'use client'
import PieChartCustomLabel from "@/components/pie-chart-custom-label"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IMetric } from "@/interfaces/IMetrics"
import { IPainel } from "@/interfaces/IPanels"
import { IProject } from "@/interfaces/IProjects"
import { cn } from "@/lib/utils"
import { MetricsServices } from "@/services/metrics.service"
import { PainelService } from "@/services/panel.service"
import { ProjectService } from "@/services/project.service"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import { Check, ChevronsUpDown, Ellipsis } from "lucide-react"
import { useEffect, useState } from "react"

interface ClickThroughRateProps {
  projects: IProject[]
  panelsClicksMetrics: IMetric[]
  panels: IPainel[]
}

type PanelMetric = {
  name: string
  cliques: string | number
  fill: string
}

export default function ClickThroughRate ({
  projects,
  panelsClicksMetrics,
  panels
}: ClickThroughRateProps) {

  const [allProjects, setProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
  
  const [allClickMetrics, setAllClickMetrics] = useState<IMetric[]>([])
  
  const [panelMetrics, setPanelMetrics] = useState<PanelMetric[]>([])

  const [selectedProjectId, setSelectedProjectId] = useState<number | string>(1)
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("ruancordel")

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

  const colorPalette = [
    "hsl(0, 70%, 50%)",
    "hsl(45, 70%, 50%)",
    "hsl(120, 70%, 50%)",
    "hsl(200, 70%, 50%)",
    "hsl(280, 70%, 50%)",
  ]

  const getColor = (index: number) =>
    colorPalette[index % colorPalette.length]

  useEffect(() => {
    const getPanelMetrics = async () => {
      if (!panelsClicksMetrics) return

      const validPanels = panels.filter(({ painel_style }) =>
        ["link", "basic", "advanced"].includes(painel_style)
      )

      const panelMetrics = validPanels.map((panel, index) => {
        const panelId = panel.id
          const clicks = panelsClicksMetrics.reduce((count, metric) => {
            const metricId = metric.link_type.split('-').pop()
            return Number(metricId) === Number(panelId) ? count + 1 : count
          }, 0)

        return {
          name: panel.painel_title,
          cliques: clicks,
          fill: getColor(index)
        }
      }).filter(({ cliques }) => cliques > 0)

      setPanelMetrics(panelMetrics)
    }

    getPanelMetrics()
  }, [selectedProjectId, allClickMetrics, panelsClicksMetrics])

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg"
    >
      <div
        className="flex justify-between items-center"
      >
        <div
          className="flex items-center gap-4"
        >
          <p
            className="text-[#0E0E0E] font-semibold text-base"
          >
            Taxa de Cliques (CTR)
          </p>

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[200px] justify-between"
                aria-expanded={open}
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
                    {
                      paginatedProjects.map(({ id, linkstoBe }, index) => (
                        <CommandItem
                          key={index}
                          value={linkstoBe}
                          onSelect={(currentValue) => {
                            setSelectedProjectId(id)
                            setValue(currentValue)
                            setOpen(false)
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
          </Popover> */}
        </div>
      </div>
      <div>
        <PieChartCustomLabel 
          label="cliques"
          metrics={panelMetrics}
          key="cliques"
        />
      </div>
    </div>
  )
}