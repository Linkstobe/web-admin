'use client'
import PieChartCustomLabel from "@/components/pie-chart-custom-label"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IProject } from "@/interfaces/IProjects"
import { cn } from "@/lib/utils"
import { ProjectService } from "@/services/project.service"
import { Pagination, PaginationItem, Stack } from "@mui/material"
import { Check, ChevronsUpDown, Ellipsis } from "lucide-react"
import { useEffect, useState } from "react"

export default function AverageTimeOnPage () {
  const [projects, setProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
  
  const [selectedProject, setSelectedProject] = useState<string>("")
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
     setFilteredProjects(projects) 
     return
    }

    const filteredData: IProject[] = projects.filter(({ linkstoBe }) => linkstoBe.includes(value))

    setFilteredProjects(filteredData)
    setCurrentPage(1)
  }


  useEffect(() => {
    const getProjectMetrics = async () => {
      const allProjects: IProject[] = await ProjectService.getAllProject()
      setProjects(allProjects)
      setFilteredProjects(allProjects)
    }

    getProjectMetrics()
  }, [])

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
            Tempo Médio de Permanência
          </p>

          <Popover>
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
                      paginatedProjects.map(({ linkstoBe }, index) => (
                        <CommandItem
                          key={index}
                          value={linkstoBe}
                          onSelect={(currentValue) => {
                            setSelectedProject(currentValue)
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
          </Popover>
        </div>
        
        <Ellipsis />
      </div>
      <div>
      </div>
    </div>
  )
}