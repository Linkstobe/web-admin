'use client'

import { Table } from "@/components/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings } from "lucide-react"
import DetailedComplaintModal from "./detailed-complaint-modal"
import ConfirmationModal from "@/components/confirmation-modal"
import { IComplaint } from "@/interfaces/IComplaints"
import { IProject } from "@/interfaces/IProjects"
import { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"
import Link from "next/link"

interface ReportedProjectsTableProps {
  complaints: IComplaint[]
  projects: IProject[]
  users: IUser[]
}

type TableItem = {
  username: string
  linkstoBe: string
  reason: string
  complaintDate: string
  complaintId: number
  projectId: number
  userId: number
}

export default function ReportedProjectsTable ({
  complaints,
  projects,
  users
}: ReportedProjectsTableProps) {
  const [tableItems, setTableItems] = useState<TableItem[]>([])

  useEffect(() => {
    const onGetTableItems = () => {
    const tableItems: TableItem[] = complaints.map((complaint) => {
      const project: IProject = projects.find((proj) => proj.id === complaint.project_id)
      const user: IUser = users.find((user) => user.id === project.user_id)

      return {
        reason: complaint.type,
        linkstoBe: project.linkstoBe,
        username: user.name,
        complaintDate: new Date(complaint.createdAt).toLocaleDateString("pt-BR"),
        complaintId: complaint.id,
        projectId: project.id,
        userId: user.id
      }
    })
    setTableItems(tableItems)
  }

    onGetTableItems()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Projetos denunciados"
        />

        {/* <Table.Search /> */}
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome do usuário" />
            <Table.HeaderItem title="Nome do projeto" />
            <Table.HeaderItem title="Motivo da denúncia" />
            <Table.HeaderItem title="Data da denúncia" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            tableItems.map(({ username, linkstoBe, reason, complaintDate, complaintId, projectId, userId }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem 
                  text={username}
                  explanation={username}
                />
                <Table.BodyItem
                >
                  <Link
                    target="_blank"
                    href={"https://linksto.be/" + linkstoBe}
                    className="underline text-[#164F62] font-semibold"
                  >
                    {linkstoBe}
                  </Link>
                </Table.BodyItem>
                <Table.BodyItem 
                  text={reason}
                  explanation={reason}
                />
                <Table.BodyItem 
                  text={complaintDate}
                  explanation={complaintDate}
                />
                <Table.BodyItem>
                  <Popover>
                    <PopoverTrigger>
                      <Table.BasicAction 
                        tooltipText="Gerênciar"
                        icon={Settings}
                        className="text-[#767676]"
                      />
                    </PopoverTrigger>

                    <PopoverContent className="p-0 w-48">
                      <DetailedComplaintModal
                        complaintId={complaintId}
                        projectId={projectId}
                        userId={userId}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Ver denúncia
                        </Button>
                      </DetailedComplaintModal>

                      <ConfirmationModal
                        onConfirm={() => {}}
                        title="Confirmação de exclusão do projeto"
                        description="Você está prestes a deletar esse projeto. Isso implica na sua exclusão e todos os seus itens. Deseja excluir projeto?"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Bloquear projeto
                        </Button>
                      </ConfirmationModal>

                      <ConfirmationModal
                        onConfirm={() => {}}
                        title="Confirmação de exclusão do projeto"
                        description="Você está prestes a deletar esse projeto. Isso implica na sua exclusão e todos os seus itens. Deseja excluir projeto?"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Bloquear usuário
                        </Button>
                      </ConfirmationModal>

                      <ConfirmationModal
                        onConfirm={() => {}}
                        title="Confirmação de exclusão do projeto"
                        description="Você está prestes a deletar esse projeto. Isso implica na sua exclusão e todos os seus itens. Deseja excluir projeto?"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Excluir projeto
                        </Button>
                      </ConfirmationModal>
                    </PopoverContent>
                  </Popover>
                </Table.BodyItem>
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>

      <Table.Footer>
        <div></div>
      </Table.Footer>
    </Table.Root>
  )
}