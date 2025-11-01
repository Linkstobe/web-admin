import { updateFinancialMovementStatus } from "@/services/financial.service";
import type { TFinancialMovementStatus } from "@/interfaces/IFinancial";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface UpdateFinancialMovementStatusVariables {
  movementId: number;
  status: TFinancialMovementStatus;
}

type UpdateFinancialMovementStatusResponse = Awaited<
  ReturnType<typeof updateFinancialMovementStatus>
>;

export function useUpdateFinancialMovementStatus(
  options?: UseMutationOptions<
    UpdateFinancialMovementStatusResponse,
    unknown,
    UpdateFinancialMovementStatusVariables
  >
) {
  return useMutation<
    UpdateFinancialMovementStatusResponse,
    unknown,
    UpdateFinancialMovementStatusVariables
  >({
    mutationKey: ["financial", "update-movement-status"],
    mutationFn: ({ movementId, status }) =>
      updateFinancialMovementStatus(movementId, status),
    ...options,
  });
}
