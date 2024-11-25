'use client'

import { Table } from "@/components/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings } from "lucide-react"
import DetailedComplaintModal from "./detailed-complaint-modal"
import ConfirmationModal from "@/components/confirmation-modal"

export default function ReportedProjectsTable () {
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
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          <Table.Row>
            <Table.BodyItem text="Username" />
            <Table.BodyItem text="Projeto" />
            <Table.BodyItem text="Motivo" />

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
                  <DetailedComplaintModal>
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
                      Excluir projeto
                    </Button>
                  </ConfirmationModal>
                </PopoverContent>
              </Popover>
            </Table.BodyItem>
          </Table.Row>
        </Table.BodySection>
      </Table.Content>

      <Table.Footer>
        <div></div>
      </Table.Footer>
    </Table.Root>
  )
}