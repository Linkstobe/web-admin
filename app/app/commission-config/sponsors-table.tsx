"use client";

import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ISponsor } from "@/interfaces/IAffiliateSubCommissionConfig";
import { AffiliateSubCommissionConfigService } from "@/services/affiliate-sub-commission-config.service";
import { Pagination, Stack } from "@mui/material";
import { ChevronRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SponsorsTable() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<ISponsor[] | undefined>(undefined);
  const [filteredSponsors, setFilteredSponsors] = useState<ISponsor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const paginatedSponsors = filteredSponsors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_event: unknown, page: number): void => {
    setCurrentPage(page);
  };

  const onFilterSponsors = (value: string): void => {
    if (!sponsors) return;

    if (value.trim() === "") {
      setFilteredSponsors(sponsors);
      return;
    }

    const filtered = sponsors.filter((item) =>
      [item.name, item.email, item.cellphone].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value.trim().toLowerCase())
      )
    );

    setFilteredSponsors(filtered);
    setCurrentPage(1);
  };

  const loadSponsors = async () => {
    try {
      const data =
        await AffiliateSubCommissionConfigService.getSponsorsWithAffiliates();
      setSponsors(data);
      setFilteredSponsors(data);
    } catch (error) {
      console.error("Erro ao carregar sponsors:", error);
      setSponsors([]);
      setFilteredSponsors([]);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  return (
    <Table.Root className={!sponsors && "animate-pulse"}>
      <Table.TopSection>
        <Table.Title title="Afiliados - Configuração de Subcomissões" />
        <Table.Search
          placeholder="Buscar por nome ou email"
          onChange={onFilterSponsors}
        />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Afiliados" />
            <Table.HeaderItem title="Configurados" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {paginatedSponsors.map((sponsor) => (
            <Table.Row key={sponsor.id}>
              <Table.BodyItem text={sponsor.name} explanation={sponsor.name} />
              <Table.BodyItem
                text={sponsor.email}
                explanation={sponsor.email}
              />
              <Table.BodyItem>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1 font-semibold text-[#164F62]">
                        <Users size={16} />
                        {sponsor.affiliatesCount}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total de afiliados indicados por este sponsor
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Table.BodyItem>
              <Table.BodyItem>
                <span
                  className={
                    sponsor.hasConfig
                      ? "text-green-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {sponsor.hasConfig ? "Configurado" : "Não configurado"}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#767676] hover:text-[#164F62]"
                  onClick={() =>
                    router.push(`/app/commission-config/${sponsor.id}`)
                  }
                >
                  <span>Ver Afiliados</span>
                  <ChevronRight size={18} />
                </Button>
              </Table.BodyItem>
            </Table.Row>
          ))}
        </Table.BodySection>
      </Table.Content>

      {filteredSponsors.length === 0 && sponsors && (
        <div className="p-8 text-center text-gray-500">
          Nenhum sponsor encontrado.
        </div>
      )}

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination
              count={Math.ceil(filteredSponsors.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </div>
      </Table.Footer>
    </Table.Root>
  );
}
