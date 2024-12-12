'use client'
import ConfirmationModal from "@/components/confirmation-modal";
import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePermission } from "@/hook/use-permission";
import { useToast } from "@/hooks/use-toast";
import { IProject } from "@/interfaces/IProjects";
import { IUser } from "@/interfaces/IUser";
import { cn } from "@/lib/utils";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";
import { Pagination, Stack } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Crown, LockKeyhole, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type TableMetrics = {
  id: string | number
  name: string
  email: string
  cellphone: string
  status: string
  projectCount: string | number
  userProjects: IProject[]
}

type SelectedActionIcon = {
  delete: LucideIcon
  block: LucideIcon
}

export default function UsersTable () {
  const { toast } = useToast()
  const { canEdit } = usePermission()

  const [bulkModeEnable, setBulkModeEnable] = useState<boolean>(false)
  const [selectedBulkAction, setSelectedBulkAction] = useState<string>("")
  const [selectedUsersId, setSelectedUsersId] = useState<number[]>([])

  const [tableMetrics, setTableMetrics] = useState<TableMetrics[]>([])
  const [filteredTableMetrics, setFilteredTableMetrics] = useState<TableMetrics[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const metricsPerPage: number = 10

  const paginatedMetrics: TableMetrics[] = filteredTableMetrics.slice(
    (currentPage - 1) * metricsPerPage,
    currentPage * metricsPerPage
  ) 

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

   const onSelecteUser = (projectId: number, isSelected: boolean) => {
    setSelectedUsersId((prevSelected) =>
      isSelected
        ? [...prevSelected, projectId]
        : prevSelected.filter((id: number) => id !== projectId)
    )
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

  const selectedActionIcon: SelectedActionIcon = {
    delete: Trash2,
    block: LockKeyhole 
  }

  const projectDefaultImage = "https://srv538807.hstgr.cloud/uploads/file-1729101715653-720592456.webp"
  const roleStyle = {
    "basic": "bg-[#20B120]",
    "free": "bg-[#20B120]",
    "pro": "bg-[#164F62]",
    "premium": "bg-[#299FC7]",
  }

  const onResetBulkActions = () => {
    setBulkModeEnable(false)
    setSelectedBulkAction("")
    setSelectedUsersId([])
  }

  const onGetAllUsers = async () => {
    const users: IUser[] = await UserService.getAllUsers()
    const projects: IProject[] = await ProjectService.getAllProject()      

    const tableValues: TableMetrics[] = users.map(user => {
      const userProjects = projects.filter(project => project.user_id === user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        cellphone: user?.cellphone === "00" || user?.cellphone === "string" ? "sem número" : user?.cellphone,
        status: user.blocked ? "Bloqueado" : "Ativo",
        userProjects,
        projectCount: userProjects.length
      }
    })

    setTableMetrics(tableValues)
    setFilteredTableMetrics(tableValues)
  }

  const onDeleteUser = async (id: string | number) => {
    try {
      const userCanEdit = canEdit()

      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir usuário",
          description: "Você não possui permissão para excluir o usuário. Entre em contato com o administrador.",
        })
        return
      }

      await UserService.deleteUserById(id)
      toast({
        variant: "success",
        title: "Usuário excluído!",
        description: "O usuário foi excluído com sucesso.",
      })

      await onGetAllUsers()
    } catch (error) {
      console.log("UsersTable: ", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao excluir usuário. Tente novamente.",
      })
    }
  }

  const onBlockUser = async (id: string | number) => {
    try {
      const userCanEdit = canEdit()

      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir usuário",
          description: "Você não possui permissão para bloquear o usuário. Entre em contato com o administrador.",
        })
        return
      }

      await UserService.updateUserById(id, {
        blocked: true
      })
      toast({
        variant: "success",
        title: "Usuário bloqueado!",
        description: "O usuário foi bloqueado com sucesso.",
      })

      await onGetAllUsers()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao bloquear usuário",
        description: "Ocorreu um erro ao bloquear usuário. Tente novamente.",
      })
    }
  
  }

  const onDeleteSelectedUsers = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir usuários",
          description: "Você não possui permissão para excluir usuários. Entre em contato com o administrador.",
        })
        return
      }

      const deletePromises = selectedUsersId.map((id) =>
        UserService.deleteUserById(id)
      )

      await Promise.all(deletePromises)

      toast({
        variant: "success",
        title: "Usuários excluídos!",
        description: "Os usuários foram excluídos com sucesso.",
      })
    } catch (error) {
      console.log("UsersTable", error)
    } finally {
      onResetBulkActions()
    }
  }

  const onBlockSelectedUsers = async () => {
    try {
      const userCanEdit = canEdit()
      if (!userCanEdit) {
        toast({
          variant: "destructive",
          title: "Erro ao bloquear usuários",
          description: "Você não possui permissão para bloquear usuários. Entre em contato com o administrador.",
        })
        return
      }

      const blockPromises = selectedUsersId.map((id) => 
        UserService.updateUserById(id, { blocked: true })
      )

      await Promise.all(blockPromises)

      toast({
        variant: "success",
        title: "Usuários bloqueados!",
        description: "Os usuários foram bloqueados com sucesso.",
      })
    } catch (error) {
      console.log("UsersTable", error)
    }
  }

  useEffect(() => {
    onGetAllUsers()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Usuários ativos"
        />

        <Table.Search 
          placeholder="Buscar"
          onChange={onFilterMetric}
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
                  onConfirm={onDeleteSelectedUsers}
                />
              }

              {
                selectedBulkAction === "block" &&
                <Table.TopButtonConfirm 
                  onConfirm={onBlockSelectedUsers}
                />
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
                  setSelectedUsersId([])
                }}
              >
                Excluir vários usuários
              </Button>
              
              <Button
                variant="outline"
                className="w-full text-start justify-start rounded-none text-[#767676]"
                onClick={() => {
                  setBulkModeEnable(true)
                  setSelectedBulkAction("block")
                  setSelectedUsersId([])
                }}
              >
                Bloquear vários usuários
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome do usuário" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Telefone" />
            <Table.HeaderItem title="Número de projetos" />
            <Table.HeaderItem title="Status" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            paginatedMetrics.map(({ id, name, email, cellphone, projectCount, userProjects, status }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem>
                  <div
                    className="flex items-center gap-1"
                  >
                    {
                      bulkModeEnable &&
                      <Checkbox
                        id={`${id}`}
                        checked={selectedUsersId.includes(Number(id))}
                        onCheckedChange={(isChecked: boolean) => {
                          onSelecteUser(Number(id), isChecked);
                        }}
                      />
                    }
                    
                    <Label
                      htmlFor={`${id}`}
                      className="text-xs"
                    >
                      {name}
                    </Label>
                  </div>
                </Table.BodyItem>
                <Table.BodyItem text={email} explanation={email} />
                <Table.BodyItem text={cellphone} explanation={cellphone} />
                <Table.BodyItem>
                  <Popover>
                    <PopoverTrigger>
                      <span
                        className="underline text-[#164F62] font-semibold"
                      >
                        { projectCount }
                      </span>
                    </PopoverTrigger>

                    <PopoverContent
                      className="flex flex-col gap-2"
                    >
                      {
                        userProjects.map(({ id, logo_url, role, title, linkstoBe }) => (
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
                                // @ts-ignore
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
                <Table.BodyItem text={status} explanation={status} />
                <Table.BodyItem>
                  <Popover>
                    <PopoverTrigger>
                      <Table.BasicAction
                        icon={Settings}
                        tooltipText="Gerênciar"
                        className="text-[#767676]"
                      >
                      </Table.BasicAction>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-48">
                      <ConfirmationModal
                        title="Confirmação de exclusão do usuário"
                        description="Você está prestes a excluir esse usuário. Isso implica na exclusão do usuário e de todos os seus itens. Deseja excluir usuário?"
                        onConfirm={() => onDeleteUser(id)}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Excluir usuário
                        </Button>
                      </ConfirmationModal>
                      <ConfirmationModal
                        title="Confirmação de bloqueio do usuário"
                        description="Você está prestes a bloquear esse usuário. O usuário perderá acesso à conta e seus projetos passarão a não estar mais ativos. Deseja bloquear usuário?"
                        onConfirm={() => onBlockUser(id)}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Bloquear usuário
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