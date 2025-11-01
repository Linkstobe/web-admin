export interface IFinancialMovement {
  id: number;
  status_movement: string;
  originMovement: string | null;
  tipo_movimento: string;
  class: string;
  amount: number;
  description: string;
  extra_info: string | null;
  pix_key_type: string | null;
  pix_key: string | null;
  is_available_withdraw: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IFilterMovementsResponse {
  status: boolean;
  data: IFinancialMovement[];
}

export type TFinancialMovementStatus = "PENDENTE" | "APROVADA" | "NEGADO";
