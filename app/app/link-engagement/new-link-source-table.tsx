'use client'
import React, { useEffect, useState } from "react"
import { Table } from "@/components/table"
import { IProject } from "@/interfaces/IProjects"
import { IUser } from "@/interfaces/IUser"
import { ProjectService } from "@/services/project.service"
import { UserService } from "@/services/user.service"
import { Pagination, Stack } from "@mui/material"
import { Crown, Ellipsis, List } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode"
import { cn } from "@/lib/utils"

interface NewLinkSourceTableProps {
  projects: IProject[]
  users: IUser[]
}

type TableMetrics = {
  linkstoBe: string
  newLinks: IProject[]
  userName: string
}

export default function NewLinkSourceTable({
  projects,
  users
}: NewLinkSourceTableProps) {
  const [tableMetrics, setTableMetrics] = useState<TableMetrics[]>([])
  const [filteredTableMetrics, setFilteredTableMetrics] = useState<TableMetrics[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const metricsPerPage: number = 10

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterMetric = (value: string): void => {
    if (value.trim() === "") {
      setFilteredTableMetrics(tableMetrics)
      return
    }

    const filteredData: TableMetrics[] = tableMetrics.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.trim().toLowerCase())
      )
    )

    setFilteredTableMetrics(filteredData)
    setCurrentPage(1)
  }

  const projectDefaultImage = "https://srv538807.hstgr.cloud/uploads/file-1729101715653-720592456.webp"
  const roleStyle = {
    "basic": "bg-[#20B120]",
    "free": "bg-[#20B120]",
    "pro": "bg-[#164F62]",
    "premium": "bg-[#299FC7]",
  }

  useEffect(() => {
    const getNewProjectMetrics = async () => {
      const validProjects = projects.filter(({ linkstoBe }) => 
        !linkstoBe.includes("temanovo_") &&
        !linkstoBe.includes("tema_") &&
        !linkstoBe.includes("modelos_linkstobe")
      )

      const projectMetrics: TableMetrics[] = validProjects.map((project) => {
        const relatedProjects = validProjects.filter(
          (p) => Number(p.referral_id) === Number(project.id)
        )

        const user = users.find((u) => Number(u.id) === Number(project.user_id))

        return {
          linkstoBe: project.linkstoBe,
          newLinks: relatedProjects,
          userName: user.name,
        }
      }).sort((a, b) => b.newLinks.length - a.newLinks.length)

      setTableMetrics(projectMetrics)
      setFilteredTableMetrics(projectMetrics)
    }

    getNewProjectMetrics()
  }, [])

  const firstTableMetrics = filteredTableMetrics.slice(
    (currentPage - 1) * metricsPerPage,
    currentPage * metricsPerPage
  )

  const secondTableMetrics = filteredTableMetrics.slice(
    currentPage * metricsPerPage,
    (currentPage + 1) * metricsPerPage
  )

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title title="Origem de Novos Projetos" />
        <Table.Search placeholder="Buscar" onChange={onFilterMetric} />
      </Table.TopSection>

      <div className="grid grid-cols-2 gap-4">
        {/* Primeira Tabela */}
        <Table.Content>
          <Table.HeaderSection>
            <Table.Row>
              <Table.HeaderItem title="Posição" />
              <Table.HeaderItem title="Nome do usuário" />
              <Table.HeaderItem title="Link do usuário" />
              <Table.HeaderItem title="Novos Projetos" />
              <Table.HeaderItem title="" />
            </Table.Row>
          </Table.HeaderSection>
          <Table.BodySection>
            {firstTableMetrics.map(({ linkstoBe, newLinks, userName }, index) => (
              <Table.Row key={`first-table-${index}`}>
                <Table.BodyItem text={`${(currentPage - 1) * metricsPerPage + index + 1}°`} />
                <Table.BodyItem text={userName} />
                <Table.BodyItem>
                  <Link
                    href={"https://linksto.be/" + linkstoBe}
                    className="underline text-[#164F62] font-semibold"
                    target="_blank"
                  >
                    { linkstoBe }
                  </Link>
                </Table.BodyItem>
                <Table.BodyItem text={newLinks.length.toString()} />
                <Table.BodyItem
                  className="text-end"
                >
                  <Popover>
                    <PopoverTrigger>
                      <List />
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex flex-col gap-2"
                    >
                      {
                        newLinks.map(({ id, logo_url, role, title, linkstoBe }) => (
                          <Link
                            key={id}
                            className="flex justify-between items-center bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-lg"
                            href={"https://linksto.be/" + linkstoBe}
                            target="_blank"
                          >
                            
                            <img 
                              src={logo_url || projectDefaultImage}
                              alt=""
                              className="rounded-full size-8 border object-cover"
                            />

                            <span
                              className="text-sm"
                            >{ title }</span>

                            <span
                              className={cn(
                                "p-1 rounded-lg text-white",
                                //@ts-ignore
                                roleStyle[jwtDecode(role)?.role.toLowerCase()]
                              )}
                            >
                              <Crown 
                                color="#ffffff"
                                size={16}
                              />
                            </span>
                          </Link>
                        ))
                      }
                    </PopoverContent>
                  </Popover>
                </Table.BodyItem>
              </Table.Row>
            ))}
          </Table.BodySection>
        </Table.Content>

        {/* Segunda Tabela */}
        <Table.Content>
          <Table.HeaderSection>
            <Table.Row>
              <Table.HeaderItem title="Posição" />
              <Table.HeaderItem title="Nome do usuário" />
              <Table.HeaderItem title="Link do usuário" />
              <Table.HeaderItem title="Novos Links" />
              <Table.HeaderItem title="" />
            </Table.Row>
          </Table.HeaderSection>
          <Table.BodySection>
            {secondTableMetrics.map(({ linkstoBe, newLinks, userName }, index) => (
              <Table.Row key={`second-table-${index}`}>
                <Table.BodyItem
                  text={`${currentPage * metricsPerPage + index + 1}°`}
                />
                <Table.BodyItem text={userName} />
                <Table.BodyItem>
                  <Link
                    href={"https://linksto.be/" + linkstoBe}
                    target="_blank"
                    className="underline text-[#164F62] font-semibold"
                  >
                    { linkstoBe }
                  </Link>
                </Table.BodyItem>
                <Table.BodyItem text={newLinks.length.toString()} />

                <Table.BodyItem
                  className="text-end"
                >
                  <Popover>
                    <PopoverTrigger>
                      <List />
                    </PopoverTrigger>
                    <PopoverContent
                      className="flex flex-col gap-2"
                    >
                      {
                        newLinks.map(({ id, logo_url, role, title, linkstoBe }) => (
                          <Link
                            key={id}
                            className="flex justify-between items-center bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-lg"
                            href={"https://linksto.be/" + linkstoBe}
                            target="_blank"
                          >
                            
                            <img 
                              src={logo_url || projectDefaultImage}
                              alt=""
                              className="rounded-full size-8 border object-cover"
                            />

                            <span
                              className="text-sm"
                            >{ title }</span>

                            <span
                              className={cn(
                                "p-1 rounded-lg text-white",
                                //@ts-ignore
                                roleStyle[jwtDecode(role)?.role.toLowerCase()]
                              )}
                            >
                              <Crown
                                size={16}
                              />
                            </span>
                          </Link>
                        ))
                      }
                    </PopoverContent>
                  </Popover>
                </Table.BodyItem>
              </Table.Row>
            ))}
          </Table.BodySection>
        </Table.Content>
      </div>

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination
              count={Math.ceil(filteredTableMetrics.length / metricsPerPage)}
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
