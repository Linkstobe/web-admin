'use client'

import { Table } from "@/components/table";
import { UserService } from "@/services/user.service";
import { Settings, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ManagePermissionModal from "./manage-permission-modal";

export default function AdminTable () {
  const [allAdmins, setAllAdmins] = useState([])
  const [filteredAllAdmins, setFilteredAllAdmins] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  const paginatedAdmins = filteredAllAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (event:any, page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const getAllAdmins = async () => {
      try {
        const users = await UserService.getAllUsers()
        const admins = users.filter(({ permission }) => permission)
        setAllAdmins(admins)
        setFilteredAllAdmins(admins)
        console.log({ admins });
      } catch (error) {
        console.log(error);
      }
    }

    getAllAdmins()
  }, [])

  return (
    <Table.Root>
      <Table.TopSection>
        <Table.Title 
          title="Administradores cadastrados"
        />

        <Table.Search
          placeholder="Buscar"
          onChange={onFilterProject}
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
            <Table.HeaderItem title="Email do usuário" />
            <Table.HeaderItem title="Permissões" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {
            paginatedAdmins.map(({ name, email, permission, id }, index) => (
              <Table.Row
                key={index}
              >
                <Table.BodyItem 
                  text={name}
                />
                <Table.BodyItem 
                  text={email}
                />
                <Table.BodyItem 
                  text={permission === "ver" ? "Somente ver" : "Ver e editar"}
                />
                <Table.BodyItem>
                  <ManagePermissionModal
                    userId={id}
                  >
                    <div className="flex justify-end">
                      <Table.BasicAction 
                        tooltipText="Configurações"
                        icon={Settings}
                        className="text-[#767676]"
                      />
                    </div>
                  </ManagePermissionModal>
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
              count={Math.ceil(filteredAllAdmins.length / itemsPerPage)} 
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