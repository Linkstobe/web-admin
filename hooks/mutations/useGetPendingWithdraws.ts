import { filterMovements } from "@/services/financial.service";
import type { IFilterMovementsResponse } from "@/interfaces/IFinancial";
import { useMutation } from "@tanstack/react-query";

interface GetPendingWithdrawsVariables {
  startDate: string;
  endDate: string;
}

export function useGetPendingWithdraws() {
  return useMutation({
    mutationKey: ["financial", "pending-withdraws"],
    mutationFn: ({
      startDate,
      endDate,
    }: GetPendingWithdrawsVariables): Promise<IFilterMovementsResponse> =>
      filterMovements(startDate, endDate),
  });
}
