"use client";

import { Table } from "@/components/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IAffiliateSubCommissionConfig,
  IEligibleInfluencer,
} from "@/interfaces/IAffiliateSubCommissionConfig";
import { AffiliateSubCommissionConfigService } from "@/services/affiliate-sub-commission-config.service";
import { Pagination, Stack } from "@mui/material";
import { Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import EditCommissionModal from "./edit-commission-modal";

interface InfluencerWithConfig extends IEligibleInfluencer {
  config: IAffiliateSubCommissionConfig | null;
}

export default function AffiliatorsTable() {
  const [influencers, setInfluencers] = useState<
    InfluencerWithConfig[] | undefined
  >(undefined);
  const [filteredInfluencers, setFilteredInfluencers] = useState<
    InfluencerWithConfig[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const paginatedInfluencers = filteredInfluencers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_event: unknown, page: number): void => {
    setCurrentPage(page);
  };

  const onFilterInfluencers = (value: string): void => {
    if (!influencers) return;

    if (value.trim() === "") {
      setFilteredInfluencers(influencers);
      return;
    }

    const filtered = influencers.filter((item) =>
      [item.name, item.email, item.cellphone].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value.trim().toLowerCase())
      )
    );

    setFilteredInfluencers(filtered);
    setCurrentPage(1);
  };

  const loadInfluencers = async () => {
    try {
      const eligibleInfluencers =
        await AffiliateSubCommissionConfigService.getEligibleInfluencers();

      const influencersWithConfig = await Promise.all(
        eligibleInfluencers.map(async (influencer) => {
          const config =
            await AffiliateSubCommissionConfigService.getConfigByUserId(
              influencer.id
            );
          return {
            ...influencer,
            config,
          };
        })
      );

      setInfluencers(influencersWithConfig);
      setFilteredInfluencers(influencersWithConfig);
    } catch (error) {
      console.error("Erro ao carregar afiliadores:", error);
      setInfluencers([]);
      setFilteredInfluencers([]);
    }
  };

  useEffect(() => {
    loadInfluencers();
  }, []);

  return (
    <Table.Root className={!influencers && "animate-pulse"}>
      <Table.TopSection>
        <Table.Title title="Afiliadores - Configuração de Comissões" />
        <Table.Search
          placeholder="Buscar por nome ou email"
          onChange={onFilterInfluencers}
        />
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="Nome" />
            <Table.HeaderItem title="Email" />
            <Table.HeaderItem title="Painéis Ativos" />
            <Table.HeaderItem title="Total Indicados" />
            <Table.HeaderItem title="% Influencer" />
            <Table.HeaderItem title="% Plataforma" />
            <Table.HeaderItem title="" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {paginatedInfluencers.map((influencer) => (
            <Table.Row key={influencer.id}>
              <Table.BodyItem
                text={influencer.name}
                explanation={influencer.name}
              />
              <Table.BodyItem
                text={influencer.email}
                explanation={influencer.email}
              />
              <Table.BodyItem>
                <Popover>
                  <PopoverTrigger>
                    <span className="underline text-[#164F62] font-semibold cursor-pointer">
                      {influencer.activePanelsCount}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <p className="font-medium text-sm mb-2">
                        Painéis ativos:
                      </p>
                      {influencer.panels.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Nenhum painel ativo
                        </p>
                      ) : (
                        influencer.panels.map((panel) => (
                          <div
                            key={panel.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm truncate max-w-[150px]">
                              {panel.banner_title || `Painel #${panel.id}`}
                            </span>
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="flex items-center gap-1 text-xs text-gray-600">
                                    <Users size={14} />
                                    {panel.indicatedUsersCount}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Usuários indicados por este painel
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </Table.BodyItem>
              <Table.BodyItem>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="font-semibold">
                        {influencer.totalIndicatedUsers}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total de usuários indicados por todos os painéis
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Table.BodyItem>
              <Table.BodyItem>
                <span
                  className={
                    influencer.config?.sub_percent_influencer
                      ? "text-green-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {influencer.config?.sub_percent_influencer
                    ? `${parseFloat(
                        influencer.config.sub_percent_influencer.toString()
                      ).toString()}%`
                    : "Não configurado"}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <span
                  className={
                    influencer.config?.sub_percent_platform
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {influencer.config?.sub_percent_platform
                    ? `${parseFloat(
                        influencer.config.sub_percent_platform.toString()
                      ).toString()}%`
                    : "Não configurado"}
                </span>
              </Table.BodyItem>
              <Table.BodyItem>
                <EditCommissionModal
                  influencer={influencer}
                  existingConfig={influencer.config}
                  onSuccess={loadInfluencers}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#767676] hover:text-[#164F62]"
                  >
                    <Settings size={18} />
                    <span className="ml-1">Configurar</span>
                  </Button>
                </EditCommissionModal>
              </Table.BodyItem>
            </Table.Row>
          ))}
        </Table.BodySection>
      </Table.Content>

      {filteredInfluencers.length === 0 && influencers && (
        <div className="p-8 text-center text-gray-500">
          Nenhum afiliador encontrado.
        </div>
      )}

      <Table.Footer>
        <div className="px-4 py-2 flex justify-end">
          <Stack>
            <Pagination
              count={Math.ceil(filteredInfluencers.length / itemsPerPage)}
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
