"use client"

import { Table } from "@/components/table"
import { Badge } from "@/components/ui/badge"
import { ProjectService } from "@/services/project.service"
import { UserService } from "@/services/user.service"
import { Settings, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import PlanChangeModal from "./plan-change-modal"
import UserInfoChangeModal from "./user-info-change-modal"

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export function PlansTable() {
  const [allProjects, setAllProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const onFilterProject = (value: string) => {
    if (value.trim() === "") { 
      setFilteredProjects(allProjects) 
      return
    }

    const filteredData = allProjects.filter(item =>
      Object.values(item).some(
        field => typeof field === 'string' && field.toLowerCase().includes(value.trim().toLowerCase())
      )
    );

    setFilteredProjects(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getAllProject = async () => {
      const projects = await ProjectService.getAllProject()
      const users = await UserService.getAllUsers()

      const combinedData = projects.map(project => {
        const user = users.find(user => user.id === project.user_id);

        const decodedToken = project?.role ? jwtDecode(project.role) : {};
        // @ts-ignore
        const plan = decodedToken?.role && decodedToken.role !== "basic" ? decodedToken.role : "FREE";
        
        return {
          linkstoBe: project.linkstoBe,
          name: user?.name || '',
          email: user?.email || '',
          cellphone: user?.cellphone === "00" || user?.cellphone === "string" ? "sem número" : user?.cellphone,
          plan,
          project_id: project.id,
          user_id: user.id
        };
      });
      
      setAllProjects(combinedData)
      setFilteredProjects(combinedData)
    }

    getAllProject()
  }, [])

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Usuários ativos"
        />

        <Table.Search
          onChange={onFilterProject}
          placeholder="Buscar"
        />

        <Table.TopButton
          icon={SquarePen}
          className="text-white"
        />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome do usuário" />
            <Table.HeaderItem title="Link do usuário" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Telefone" />
            <Table.HeaderItem title="Plano" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            paginatedProjects.map(({ name, linkstoBe, email, cellphone, plan, project_id, user_id }, index) => (
              <Table.Row key={index}>
                <Table.BodyItem text={name} />
                <Table.BodyItem text={"linksto.be/" + linkstoBe} />
                <Table.BodyItem text={email} />
                <Table.BodyItem text={cellphone} />
                <Table.BodyItem>
                  <Badge
                    className={
                      cn(
                        plan?.toUpperCase() === "PREMIUM" ? "bg-[#299FC7]"
                        : (plan?.toUpperCase() === "PRO" ? "bg-[#164F62]"
                          : "bg-[#20B120]"
                        )
                      )
                    }
                  >
                    { plan?.toUpperCase() }
                  </Badge>
                </Table.BodyItem>
                <Table.BodyItem>
                  <Popover>
                    <PopoverTrigger>
                      <Table.BasicAction 
                        tooltipText="Configurações"
                        icon={Settings}
                        className="text-[#767676]"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-48">
                      <UserInfoChangeModal
                        userId={user_id}
                        projectId={project_id}
                        name={name}
                        linkstoBe={linkstoBe}
                        email={email}
                        cellphone={cellphone === "sem número" ? "55" : cellphone}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Editar dados
                        </Button>
                      </UserInfoChangeModal>
                      <PlanChangeModal projectId={project_id}>
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Alterar assinatura
                        </Button>
                      </PlanChangeModal>
                    </PopoverContent>
                  </Popover>
                </Table.BodyItem>
              </Table.Row>
            ))
          }
        </Table.BodySection>
      </Table.Content>

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(filteredProjects.length / itemsPerPage)} 
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
