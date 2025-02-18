import { Modal } from "@/components/modal";
import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProject } from "@/interfaces/IProjects";
import { IUser } from "@/interfaces/IUser";
import { handleGetMenuList } from "@/lib/menu-list";
import { ProjectService } from "@/services/project.service";
import { UserService } from "@/services/user.service";
import { Pagination, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes, useEffect, useState } from "react";

interface ManageAccessModalProps extends HTMLAttributes<HTMLDivElement> {}

interface TableItem {
  username: string
  linkstoBe: string
  projectId: string | number
}

export default function ManageAccessModal ({
  children
}: ManageAccessModalProps) {
  const [allTableItems, setAllTableItems] = useState<TableItem[]>([])
  const [filteredTableItems, setFilteredTableItems] = useState<TableItem[]>([])

  const pathname = usePathname()
  const menus = handleGetMenuList(pathname)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const tableItemsPerPage: number = 8

  const paginatedTableItems: TableItem[] = filteredTableItems.slice(
    (currentPage - 1) * tableItemsPerPage,
    currentPage * tableItemsPerPage
  ) 

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page)
  }

  const onFilterTableItems = (value: string): void => {
    if (value.trim() === "") {
      setFilteredTableItems(allTableItems)
      return
    }

    const filteredData: TableItem[] = allTableItems.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.trim().toLowerCase())
      )
    )

    setFilteredTableItems(filteredData)
    setCurrentPage(1)
  }

  const [currentMenusGroupPage, setCurrentMenusGroupPage] = useState<number>(1)
  const menusGroupsPerPage: number = 2

  const paginatedMenusGroups = menus.slice(
    (currentMenusGroupPage - 1) * menusGroupsPerPage,
    currentMenusGroupPage * menusGroupsPerPage
  ) 


  const handleGroupPageChange = (event: any, page: number): void => {
    setCurrentMenusGroupPage(page)
  }

  const [selectedProjectsIdToManage, setSelectedProjectsIdToManage] = useState<number[]>([])
  const [managerAccessiblePages, setManagerAccessiblePages] = useState<string[]>([
    "Relatórios",
    "Formulários",
    "Produtos"
  ])

  const onSelectPage = (pageName: string) => {
    const hasBeenAdded = managerAccessiblePages.includes(pageName)
    if (hasBeenAdded) {
      setManagerAccessiblePages(prev => prev.filter((value) => value !== pageName))
      return
    }

    setManagerAccessiblePages(prev => [...prev, pageName])
  }

  const onSelectProject = (projectId: number) => {
    const hasBeenAdded = selectedProjectsIdToManage.includes(projectId);
    if (hasBeenAdded) {
      setSelectedProjectsIdToManage(prev => prev.filter(value => value !== projectId));
      return;
    }

    setSelectedProjectsIdToManage(prev => [...prev, projectId]);
  };


  useEffect(() => {
    const onGetProjectsForSelection = async () => {
      try {
        const projects = await ProjectService.getAllProject()
        const users = await UserService.getAllUsers()

        const tableItems: TableItem[] = projects.map(project => {
          const user = users.find(user => user.id === project.user_id)
          return {
            linkstoBe: project.linkstoBe,
            username: user.name,
            projectId: project.id
          }
        })

        setAllTableItems(tableItems)
        setFilteredTableItems(tableItems)
      } catch (error) {
        console.log("ManageAccessModalProps: ", error)
      }
    }

    onGetProjectsForSelection()
  }, [])

  useEffect(() => {
    console.log({ selectedProjectsIdToManage })
  }, [selectedProjectsIdToManage])

  return (
    <Modal.Root>
      <Modal.OpenButton>
        {children}
      </Modal.OpenButton>
      <Modal.Container>
        <Modal.Header>
          <Modal.Title
            title="Gerenciar acessos do gerente"
          />
        </Modal.Header>

        <Modal.Content>
          <div>
            <Tabs defaultValue="pages" className="">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pages" className="transition-all duration-700">Páginas</TabsTrigger>
                <TabsTrigger value="projects" className="transition-all duration-700">Projetos</TabsTrigger>
              </TabsList>
              <TabsContent value="pages">
                <Card>
                  <CardHeader>
                    <CardTitle>Selecione as páginas</CardTitle>
                    <CardDescription>
                      Nesta seção, você pode selecionar as páginas às quais o gerente terá acesso. Ele poderá visualizar somente as páginas marcadas aqui.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {
                      paginatedMenusGroups.map(({ menus, groupLabel }, index) => {
                        return (
                          <div className="flex flex-col gap-2" key={`${groupLabel}-${index}`}>
                            <h3 className="font-medium">{groupLabel}</h3>
                            <div className="flex flex-col gap-2">
                              {menus.map(({ icon: Icon, label }) => (
                                <div 
                                  className="flex items-center justify-between"
                                  key={label}
                                >
                                  <div className="flex gap-4">
                                    <Icon />
                                    <span>{label}</span>
                                  </div>

                                  <div>
                                    <Checkbox
                                      id={`${groupLabel}-${label}`}
                                      checked={managerAccessiblePages.includes(label)}
                                      onCheckedChange={() => onSelectPage(label)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })
                    }

                    <div className="py-2 flex justify-end">
                      <Stack>
                        <Pagination
                          count={Math.ceil(menus.length / menusGroupsPerPage)}
                          page={currentMenusGroupPage}
                          onChange={handleGroupPageChange}
                          variant="outlined"
                          shape="rounded"
                        />
                      </Stack>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Selecione os projetos</CardTitle>
                    <CardDescription>
                      Nesta seção, você pode selecionar os projetos aos quais o gerente terá acesso. Ele poderá visualizar as métricas somente dos projetos selecionados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Table.Root>
                      <Table.TopSection 
                        className="justify-end"
                      >
                        <Table.Search
                          onChange={onFilterTableItems}
                          placeholder="Buscar projeto"
                        />
                      </Table.TopSection>
                      <Table.Content>
                        <Table.HeaderSection>
                          <Table.Row>
                            <Table.HeaderItem title="Nome do usuário" />
                            <Table.HeaderItem title="link do projeto" />
                          </Table.Row>
                        </Table.HeaderSection>

                        <Table.BodySection>
                          {
                            paginatedTableItems.map(({
                              projectId, 
                              username, 
                              linkstoBe 
                            }) => (
                              <Table.Row
                                key={projectId}
                              >
                                <Table.BodyItem>
                                  <div
                                    className="flex items-center gap-1"
                                  >
                                    <Checkbox
                                      id={`${projectId}`}
                                      checked={selectedProjectsIdToManage.includes(Number(projectId))}
                                      onCheckedChange={() => onSelectProject(Number(projectId))}
                                    />
                                    
                                    <Label
                                      htmlFor={`${projectId}`}
                                      className="text-xs"
                                    >
                                      {username}
                                    </Label>
                                  </div>
                                </Table.BodyItem>
                                <Table.BodyItem>
                                  <Link
                                    href={"https://linksto.be/" + linkstoBe}
                                    target="_blank"
                                    className="underline text-[#164F62] font-semibold"
                                  >
                                    { linkstoBe }
                                  </Link>
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
                              count={Math.ceil(filteredTableItems.length / tableItemsPerPage)}
                              page={currentPage}
                              onChange={handlePageChange}
                              variant="outlined"
                              shape="rounded"
                            />
                          </Stack>
                        </div>
                      </Table.Footer>
                    </Table.Root>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button
            type="submit"
            className="text-white font-medium text-base py-3 px-11 bg-[#164F62] mt-1"
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal.Container>
    </Modal.Root>
  )
}