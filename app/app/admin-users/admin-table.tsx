'use client'

import { Table } from "@/components/table";
import { UserService } from "@/services/user.service";
import { Check, ChevronsUpDownIcon, Settings, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ManagePermissionModal from "./manage-permission-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import ManageAccessModal from "./manage-access-modal";

export default function AdminTable () {
  const [allAdmins, setAllAdmins] = useState([])
  const [filteredAllAdmins, setFilteredAllAdmins] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const allPermissions = [
    "all",
    "ver",
    "editar",
    "personalizar",
    "gerenciar",
  ]

  const formatedPermission = {
    all: "Todos",
    ver: "Somente ver",
    editar: "Ver e editar",
    personalizar: "Somente personalizar",
    gerenciar: "Gerenciar"
  }

  const permissionRaw = {
    "Todos": "all",
    "Somente ver": "ver",
    "Ver e editar": "editar",
    "Somente personalizar": "personalizar",
    "Gerenciar": "gerenciar"
  }

  const [selectedPermissionToFilter, setSelectedPermissionToFilter] = useState<string>("Todos")

  const onFilterProject = (value: string) => {
    if (value.trim() === "") { 
      setFilteredAllAdmins(allAdmins) 
      return
    }

    const filteredData = allAdmins.filter(item =>
      Object.values(item).some(
        field => typeof field === 'string' && field.toLowerCase().includes(value.trim().toLowerCase())
      )
    );

    setFilteredAllAdmins(filteredData)
    setCurrentPage(1)
  }

  useEffect(() => {
    const getAllAdmins = async () => {
      try {
        const users = await UserService.getAllUsers()
        const admins = users.filter(({ permission }) => permission)
        setAllAdmins(admins)
        setFilteredAllAdmins(admins)
      } catch (error) {
        console.log(error);
      }
    }

    getAllAdmins()
  }, [])

  const filteredByPermission = filteredAllAdmins.filter(
    ({ permission }) => 
      permission === permissionRaw[selectedPermissionToFilter] || 
      permissionRaw[selectedPermissionToFilter] === "all"
  )

  const paginatedAdmins = filteredByPermission.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (event:any, page: number) => {
    setCurrentPage(page)
  }

  return (
    <Table.Root>
      <Table.TopSection>
        <div className="flex items-center gap-4">
          <Table.Title title="Administradores" />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="justify-between w-full"
              >
                { selectedPermissionToFilter || "Selecione o tipo do painel..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <Command>
                <CommandInput placeholder="Pesquisar permissão" />
                <CommandList>
                  <CommandEmpty>Permissão não encontrada</CommandEmpty>
                  <CommandGroup>
                    {allPermissions.map((permission) => (
                      <CommandItem
                        key={permission}
                        value={formatedPermission[permission]}
                        onSelect={() => {
                          setSelectedPermissionToFilter(formatedPermission[permission])
                          setCurrentPage(1)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPermissionToFilter === formatedPermission[permission] ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {formatedPermission[permission]}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Table.Search placeholder="Buscar" onChange={onFilterProject} />

        <Table.TopButton icon={SquarePen} className="text-white" />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome do usuário" />
            <Table.HeaderItem title="Email do usuário" />
            <Table.HeaderItem title="Permissões" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {paginatedAdmins.map(({ name, email, permission, id }, index) => (
            <Table.Row key={index}>
              <Table.BodyItem text={name} />
              <Table.BodyItem text={email} />
              <Table.BodyItem text={formatedPermission[permission]} />
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
                    <ManagePermissionModal
                      userId={id}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-start justify-start rounded-none text-[#767676]"
                      >
                        Gerenciar Permissões
                      </Button>
                    </ManagePermissionModal>

                    {
                      permission === "editar" &&
                      <ManageAccessModal>
                        <Button
                          variant="outline"
                          className="w-full text-start justify-start rounded-none text-[#767676]"
                        >
                          Gerenciar Acessos
                        </Button>
                      </ManageAccessModal>
                    }
                  </PopoverContent>
                </Popover>
              </Table.BodyItem>
            </Table.Row>
          ))} 
        </Table.BodySection>
      </Table.Content>

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination 
              count={Math.ceil(filteredByPermission.length / itemsPerPage)} 
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
