"use client"

import { Table } from "@/components/table"
import { Badge } from "@/components/ui/badge"
import { ProjectService } from "@/services/project.service"
import { UserService } from "@/services/user.service"
import { LucideIcon, Settings, SquarePen, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import PlanChangeModal from "./plan-change-modal"
import UserInfoChangeModal from "./user-info-change-modal"

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useToast } from "@/hooks/use-toast"
import { usePermission } from "@/hook/use-permission"
import ConfirmationModal from "@/components/confirmation-modal"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type SelectedActionIcon = {
  delete: LucideIcon
  updatePlan: LucideIcon
}

type planToUpdate = "free" | "pro" | "premium" 

export function PlansTable() {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const [bulkModeEnable, setBulkModeEnable] = useState<boolean>(false)
  const [selectedBulkAction, setSelectedBulkAction] = useState<string>("")
  const [selectedProjectsId, setSelectedProjectsId] = useState<number[]>([])

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

  const selectedActionIcon: SelectedActionIcon = {
    delete: Trash2,
    updatePlan: SquarePen
  }

  const onSelecteProject = (projectId: number, isSelected: boolean) => {
    setSelectedProjectsId((prevSelected) =>
      isSelected
        ? [...prevSelected, projectId]
        : prevSelected.filter((id: number) => id !== projectId)
    )
  }
  
  const getAllProject = async () => {
    const projects = await ProjectService.getAllProject()
    const validProjects = projects
      .filter(({ linkstoBe }) => 
        !linkstoBe.includes("temanovo_") &&
        !linkstoBe.includes("tema_") &&
        !linkstoBe.includes("modelos_linkstobe")
      )

    const users = await UserService.getAllUsers()

    const combinedData = validProjects.map(project => {
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
        status: project.blocked ? "Bloqueado" : "Ativo",
        project_id: project.id,
        user_id: user.id,
        projectCreatedAt: new Date(project.createdAt).toLocaleDateString('pt-BR')
      };
    });
    
    setAllProjects(combinedData)
    setFilteredProjects(combinedData)
  }

  useEffect(() => {
    getAllProject()
  }, [])

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  const handleDeleteProject = async (id: string | number) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir projeto",
          description: "Você não possui permissão para excluir o projeto. Entre em contato com o administrador.",
        })
        return
      }

      await ProjectService.deleteProjectByID(id)
      toast({
        variant: "success",
        title: "Projeto excluído!",
        description: "O projeto foi excluído com sucesso.",
      })

      await getAllProject()
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir o projeto",
        description: "Ocorreu um erro ao fazer ao excluir o projeto. Tente novamente.",
      })
    }
  }

  const onResetBulkActions = () => {
    setBulkModeEnable(false)
    setSelectedBulkAction("")
    setSelectedProjectsId([])
  }

  const onDeleteSelectedProjects = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir projeto",
          description: "Você não possui permissão para excluir o projeto. Entre em contato com o administrador.",
        })
        return
      }
      
      const deletePromises = selectedProjectsId.map((id) =>
        ProjectService.deleteProjectByID(id)
      )

      await Promise.all(deletePromises)
      toast({
        variant: "success",
        title: "Projetos excluídos!",
        description: "Os projetos foram excluídos com sucesso.",
      })
      await getAllProject()
    } catch (error) {
      console.log("PlansTable: ", error)
    } finally {
      onResetBulkActions()
    }
  }

  const onUpdateProjectPlans = async (plan: planToUpdate) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao trocar os planos",
          description: "Você não possui permissão para trocar os planos de projetos. Entre em contato com o administrador.",
        })
        return
      }

      const updatePlanPromises = selectedProjectsId.map((id) => 
        ProjectService.updateProjectById(id, {
          role: plan
        })
      )

      await Promise.all(updatePlanPromises)

      toast({
        variant: "success",
        title: "Trocas concluídas!",
        description: "Os planos foram trocados com sucesso.",
      })

      await getAllProject()
    } catch (error) {
      console.log("PlansTable: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao trocar os planos",
        description: "Ocorreu um erro ao fazer a troca dos planos. Tente novamente.",
      })
    } finally {
      onResetBulkActions()
    }
  }

  const onBlockProject = async (id: number) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao bloquear projeto",
          description: "Você não possui permissão para bloquear um projeto. Entre em contato com o administrador.",
        })
        return
      }

      await ProjectService.updateProjectById(id, {
        blocked: true
      })

      toast({
        variant: "success",
        title: "Bloqueio concluído!",
        description: "O bloqueio foi feito com sucesso.",
      })

    } catch (error) {
      console.log("PlansTable: ", error)      
      toast({
        variant: "destructive",
        title: "Erro ao bloquer o projeto",
        description: "Ocorreu um erro ao bloquear o projeto. Tente novamente.",
      })
    }
  }

  const onUnblockProject = async (id: number) => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao desbloquear projeto",
          description: "Você não possui permissão para desbloquear um projeto. Entre em contato com o administrador.",
        })
        return
      }

      await ProjectService.updateProjectById(id, {
        blocked: false
      })

      toast({
        variant: "success",
        title: "Desbloqueio concluído!",
        description: "O desbloqueio foi feito com sucesso.",
      })

    } catch (error) {
      console.log("PlansTable: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao desbloquear o projeto",
        description: "Ocorreu um erro ao desbloquear o projeto. Tente novamente.",
      })
    }
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

        <div
          className="flex items-center gap-4"
        >
          {
            bulkModeEnable &&
            <div
              className="flex gap-2"
            >
              <Table.TableTopButtonCancel 
                onCancel={() => {
                  setBulkModeEnable(false)
                  setSelectedBulkAction("")
                }}
              />
              
              {
                selectedBulkAction === "delete" &&
                <Table.TopButtonConfirm 
                  onConfirm={onDeleteSelectedProjects}
                />
              }

              {
                selectedBulkAction === "updatePlan" &&
                <Popover>
                  <PopoverTrigger>
                    <Table.TopButtonConfirm />
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-start justify-start rounded-none text-[#767676]"
                      onClick={async () => {
                        await onUpdateProjectPlans("free")
                      }}
                    >
                      Trocar para plano Free
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-start justify-start rounded-none text-[#767676]"
                      onClick={async () => {
                        await onUpdateProjectPlans("pro")
                      }}
                    >
                      Trocar para plano Pro
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-start justify-start rounded-none text-[#767676]"
                      onClick={async () => {
                        await onUpdateProjectPlans("premium")
                      }}
                    >
                      Trocar para plano Premium
                    </Button>
                  </PopoverContent>
                </Popover>
              }

            </div>
          }

          <Popover>
            <PopoverTrigger>
              <Table.TopButton
                icon={selectedActionIcon[selectedBulkAction] || Settings}
                className="text-white"
              />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-48"
            >
              <Button
                variant="outline"
                className="w-full text-start justify-start rounded-none text-[#767676]"
                onClick={() => {
                  setBulkModeEnable(true)
                  setSelectedBulkAction("delete")
                  setSelectedProjectsId([])
                }}
              >
                Excluir vários projetos
              </Button>
              
              <Button
                variant="outline"
                className="w-full text-start justify-start rounded-none text-[#767676]"
                onClick={() => {
                  setBulkModeEnable(true)
                  setSelectedBulkAction("updatePlan")
                  setSelectedProjectsId([])
                }}
              >
                Atualizar vários planos
              </Button>

            </PopoverContent>
          </Popover>
        </div>
        
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome do usuário" />
            <Table.HeaderItem title="Link do usuário" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Telefone" />
            <Table.HeaderItem title="Status" />
            <Table.HeaderItem title="Data de criação" />
            <Table.HeaderItem title="Plano" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            paginatedProjects.map(({ name, linkstoBe, email, cellphone, projectCreatedAt, status, plan, project_id, user_id }, index) => (
              <Table.Row key={index}>
                <Table.BodyItem>
                  <div
                    className="flex items-center gap-1"
                  >
                    {
                      bulkModeEnable &&
                      <Checkbox 
                        id={linkstoBe}
                        onCheckedChange={(isChecked: boolean) => {
                          onSelecteProject(project_id, isChecked);
                        }}
                      />
                    }
                    
                    <Label
                      htmlFor={linkstoBe}
                      className="text-xs"
                    >
                      {name}
                    </Label>
                  </div>
                </Table.BodyItem>
                <Table.BodyItem>
                  <Link
                    target="_blank"
                    href={"https://linksto.be/" + linkstoBe}
                    className="underline text-[#164F62] font-semibold"
                  >
                    {linkstoBe}
                  </Link>
                </Table.BodyItem>
                <Table.BodyItem text={email} />
                <Table.BodyItem text={cellphone} />
                <Table.BodyItem text={status} />
                <Table.BodyItem text={projectCreatedAt} />
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
                      <ConfirmationModal
                        onConfirm={() => handleDeleteProject(project_id)}
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
                      
                      {
                        status === "Ativo" 
                        ? (
                          <ConfirmationModal
                            onConfirm={() => onBlockProject(project_id)}
                            title="Confirmação de bloqueio do projeto"
                            description="Você está prestes a bloquear esse projeto. O projeto passará a não ser mais visível, e não poderá realizar ações. Deseja bloquear projeto?"
                          >
                            <Button
                              variant="outline"
                              className="w-full text-start justify-start rounded-none text-[#767676]"
                            >
                              Bloquear Projeto
                            </Button>
                          </ConfirmationModal>
                        ) : (
                          <ConfirmationModal
                            onConfirm={() => onUnblockProject(project_id)}
                            title="Confirmação de desbloqueio do projeto"
                            description="Você está prestes a desbloquear esse projeto. O projeto passará a ser visível de novo, e poderá realizar ações dentro da plataforma. Deseja desbloquear projeto?"
                          >
                            <Button
                              variant="outline"
                              className="w-full text-start justify-start rounded-none text-[#767676]"
                            >
                              Desbloquear Projeto
                            </Button>
                          </ConfirmationModal>
                        )
                      }

                      <Link
                        href={"https://app.linksto.be/panels/" + project_id}
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Personalizar projeto
                        </Button>
                      </Link>
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
