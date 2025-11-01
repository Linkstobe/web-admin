"use client";

import CalendarDateRangePicker from "@/components/date-ranger-picker";
import { Table } from "@/components/table";
import { useGetPendingWithdraws } from "@/hooks/mutations/useGetPendingWithdraws";
import { useUpdateFinancialMovementStatus } from "@/hooks/mutations/useUpdateFinancialMovementStatus";
import {
  IFinancialMovement,
  TFinancialMovementStatus,
} from "@/interfaces/IFinancial";
import { Pagination, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import ConfirmationModal from "@/components/confirmation-modal";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type WithdrawTableMetric = {
  id: number;
  user_name: string;
  amount: number;
  pix_key_type: string | null;
  pix_key: string | null;
  status_movement: string;
  createdAt: string;
  description: string;
};

export default function WithdrawTable() {
  const { mutate, data, isPending } = useGetPendingWithdraws();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateFinancialMovementStatus({
      onSuccess: () => {
        toast({
          title: "Sucesso!",
          description: `Solicitação ${
            actionData.status === "APROVADA" ? "aprovada" : "negada"
          } com sucesso.`,
          variant: "default",
        });
        fetchWithdraws();
        setActionData({ movementId: null, status: null });
      },
      onError: (error: any) => {
        toast({
          title: "Erro!",
          description:
            error?.response?.data?.message ||
            "Erro ao processar solicitação. Tente novamente.",
          variant: "destructive",
        });
      },
    });

  const [withdrawData, setWithdrawData] = useState<WithdrawTableMetric[]>([]);
  const [filteredWithdrawData, setFilteredWithdrawData] = useState<
    WithdrawTableMetric[]
  >([]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
    to: new Date(),
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const withdrawsPerPage: number = 10;

  const [actionData, setActionData] = useState<{
    movementId: number | null;
    status: TFinancialMovementStatus | null;
  }>({
    movementId: null,
    status: null,
  });

  const paginatedWithdraws: WithdrawTableMetric[] = filteredWithdrawData.slice(
    (currentPage - 1) * withdrawsPerPage,
    currentPage * withdrawsPerPage
  );

  const handlePageChange = (event: any, page: number): void => {
    setCurrentPage(page);
  };

  const onFilterWithdraw = (value: string): void => {
    if (value.trim() === "") {
      setFilteredWithdrawData(withdrawData);
      return;
    }

    const filteredData: WithdrawTableMetric[] = withdrawData.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.trim().toLowerCase())
      )
    );

    setFilteredWithdrawData(filteredData);
    setCurrentPage(1);
  };

  const fetchWithdraws = () => {
    if (!date?.from) {
      return;
    }

    const startDate = format(date.from, "yyyy-MM-dd");
    const endDate = format(date.to ?? date.from, "yyyy-MM-dd");

    mutate({
      startDate,
      endDate,
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleOpenConfirmModal = (
    movementId: number,
    status: TFinancialMovementStatus
  ) => {
    setActionData({ movementId, status });
  };

  const handleConfirmAction = () => {
    if (!actionData.movementId || !actionData.status) return;

    updateStatus({
      movementId: actionData.movementId,
      status: actionData.status,
    });
  };

  useEffect(() => {
    fetchWithdraws();
  }, [date]);

  useEffect(() => {
    if (data?.data) {
      const mappedData: WithdrawTableMetric[] = data.data.map(
        (item: IFinancialMovement) => ({
          id: item.id,
          user_name: item.user.name,
          amount: item.amount,
          pix_key_type: item.pix_key_type,
          pix_key: item.pix_key,
          status_movement: item.status_movement,
          createdAt: item.createdAt,
          description: item.description,
        })
      );
      setWithdrawData(mappedData);
      setFilteredWithdrawData(mappedData);
    }
  }, [data]);

  return (
    <Table.Root className={isPending ? "animate-pulse" : ""}>
      <Table.TopSection>
        <Table.Title title="Solicitações de Saque Pendentes" />

        <div className="flex items-center gap-4 justify-end w-full pl-4">
          <Table.Search placeholder="Buscar" onChange={onFilterWithdraw} />
          <CalendarDateRangePicker date={date} setDate={setDate} />
        </div>
      </Table.TopSection>

      <Table.Content>
        <Table.HeaderSection>
          <Table.Row>
            <Table.HeaderItem title="ID" />
            <Table.HeaderItem title="Usuário" />
            <Table.HeaderItem title="Valor" />
            <Table.HeaderItem title="Tipo Chave PIX" />
            <Table.HeaderItem title="Chave PIX" />
            <Table.HeaderItem title="Status" />
            <Table.HeaderItem title="Data" />
            <Table.HeaderItem title="Ações" />
          </Table.Row>
        </Table.HeaderSection>

        <Table.BodySection>
          {paginatedWithdraws.length > 0 ? (
            paginatedWithdraws.map((withdraw) => (
              <Table.Row key={withdraw.id}>
                <Table.BodyItem>{withdraw.id}</Table.BodyItem>
                <Table.BodyItem>{withdraw.user_name}</Table.BodyItem>
                <Table.BodyItem>
                  {formatCurrency(withdraw.amount)}
                </Table.BodyItem>
                <Table.BodyItem>{withdraw.pix_key_type || "-"}</Table.BodyItem>
                <Table.BodyItem>{withdraw.pix_key || "-"}</Table.BodyItem>
                <Table.BodyItem>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      withdraw.status_movement === "PENDENTE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {withdraw.status_movement}
                  </span>
                </Table.BodyItem>
                <Table.BodyItem>
                  {formatDate(withdraw.createdAt)}
                </Table.BodyItem>
                <Table.BodyItem>
                  <div className="flex gap-2">
                    <ConfirmationModal
                      title="Aprovar Saque"
                      description={`Tem certeza que deseja aprovar esta solicitação de saque no valor de ${formatCurrency(
                        withdraw.amount
                      )}?`}
                      onConfirm={handleConfirmAction}
                    >
                      <Button
                        onClick={() =>
                          handleOpenConfirmModal(withdraw.id, "APROVADA")
                        }
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprovar
                      </Button>
                    </ConfirmationModal>
                    <ConfirmationModal
                      title="Negar Saque"
                      description={`Tem certeza que deseja negar esta solicitação de saque no valor de ${formatCurrency(
                        withdraw.amount
                      )}?`}
                      onConfirm={handleConfirmAction}
                    >
                      <Button
                        onClick={() =>
                          handleOpenConfirmModal(withdraw.id, "NEGADO")
                        }
                        disabled={isUpdating}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4" />
                        Negar
                      </Button>
                    </ConfirmationModal>
                  </div>
                </Table.BodyItem>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <td
                colSpan={8}
                className="pl-4 pr-4 py-4 text-center text-xs font-medium text-[#767676]"
              >
                {isPending
                  ? "Carregando..."
                  : "Nenhuma solicitação de saque encontrada"}
              </td>
            </Table.Row>
          )}
        </Table.BodySection>
      </Table.Content>

      {filteredWithdrawData.length > withdrawsPerPage && (
        <Table.Footer>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(filteredWithdrawData.length / withdrawsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        </Table.Footer>
      )}
    </Table.Root>
  );
}
