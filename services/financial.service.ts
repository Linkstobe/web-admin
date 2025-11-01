import { Api } from "@/provider";
import type {
  IFilterMovementsResponse,
  IFinancialMovement,
  TFinancialMovementStatus,
} from "@/interfaces/IFinancial";

export type {
  IFilterMovementsResponse,
  IFinancialMovement,
  TFinancialMovementStatus,
} from "@/interfaces/IFinancial";

export const filterMovements = async (
  startDate: string,
  endDate: string
): Promise<IFilterMovementsResponse> => {
  const { data } = await Api.post<IFilterMovementsResponse>(
    "/financial-movements/filter",
    {
      tipo_movimento: "S",
      status_movement: "PENDENTE",
      startDate: startDate,
      endDate: endDate,
    }
  );
  return data;
};

export const updateFinancialMovementStatus = async (
  movementId: number,
  status: TFinancialMovementStatus
): Promise<{ status: boolean; message: string }> => {
  const { data } = await Api.patch<{ status: boolean; message: string }>(
    `/financial-movements/${movementId}`,
    {
      status_movement: status,
    }
  );

  return data;
};
