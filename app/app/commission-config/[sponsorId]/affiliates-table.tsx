"use client";

import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import { IAffiliate } from "@/interfaces/IAffiliateSubCommissionConfig";
import { AffiliateSubCommissionConfigService } from "@/services/affiliate-sub-commission-config.service";
import { Pagination, Stack } from "@mui/material";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditAffiliateCommissionModal from "./edit-affiliate-commission-modal";

interface Props {
  sponsorId: number;
}

export default function AffiliatesTable({ sponsorId }: Props) {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<IAffiliate[] | undefined>(
    undefined
  );
  const [filteredAffiliates, setFilteredAffiliates] = useState<IAffiliate[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const paginatedAffiliates = filteredAffiliates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_event: unknown, page: number): void => {
    setCurrentPage(page);
  };

  const onFilterAffiliates = (value: string): void => {
    if (!affiliates) return;

    if (value.trim() === "") {
      setFilteredAffiliates(affiliates);
      return;
    }

    const filtered = affiliates.filter((item) =>
      [item.name, item.email, item.cellphone].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value.trim().toLowerCase())
      )
    );

    setFilteredAffiliates(filtered);
    setCurrentPage(1);
  };

  const loadAffiliates = async () => {
    try {
      const data =
        await AffiliateSubCommissionConfigService.getAffiliatesBySponsor(
          sponsorId
        );
      setAffiliates(data);
      setFilteredAffiliates(data);
    } catch (error) {
      console.error("Erro ao carregar afiliados:", error);
      setAffiliates([]);
      setFilteredAffiliates([]);
    }
  };

  useEffect(() => {
    loadAffiliates();
  }, [sponsorId]);

  const formatPercent = (value: number | undefined) => {
    if (value === undefined || value === null) return "Não configurado";
    return `${parseFloat(value.toString()).toString()}%`;
  };

  return (
    <Table.Root className={!affiliates && "animate-pulse"}>
      <Table.TopSection>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/app/commission-config")}
            className="text-[#767676] hover:text-[#164F62]"
          >
            <ArrowLeft size={18} />
            <span className="ml-1">Voltar</span>
          </Button>
          <Table.Title title="Afiliados - Configuração de Subcomissões" />
        </div>
        <Table.Search
          placeholder="Buscar por nome ou email"
          onChange={onFilterAffiliates}
        />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Painel" />
            <Table.HeaderItem title="% Sponsor" />
            <Table.HeaderItem title="% Plataforma" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {paginatedAffiliates.map((affiliate) => (
            <Table.Row key={affiliate.id}>
              <Table.BodyItem
                text={affiliate.name}
                explanation={affiliate.name}
              />
              <Table.BodyItem
                text={affiliate.email}
                explanation={affiliate.email}
              />
              <Table.BodyItem>
                <span className="text-sm text-gray-600">
                  {affiliate.panelName || "—"}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <span
                  className={
                    affiliate.config?.sub_percent_influencer
                      ? "text-green-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {formatPercent(affiliate.config?.sub_percent_influencer)}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <span
                  className={
                    affiliate.config?.sub_percent_platform
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {formatPercent(affiliate.config?.sub_percent_platform)}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <EditAffiliateCommissionModal
                  affiliate={affiliate}
                  sponsorId={sponsorId}
                  existingConfig={affiliate.config}
                  onSuccess={loadAffiliates}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#767676] hover:text-[#164F62]"
                  >
                    <Settings size={18} />
                    <span className="ml-1">Configurar</span>
                  </Button>
                </EditAffiliateCommissionModal>
              </Table.BodyItem>
            </Table.Row>
          ))}
        </Table.BodySection>
      </Table.Content>

      {filteredAffiliates.length === 0 && affiliates && (
        <div className="p-8 text-center text-gray-500">
          Nenhum afiliado encontrado para este sponsor.
        </div>
      )}

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination
              count={Math.ceil(filteredAffiliates.length / itemsPerPage)}
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
