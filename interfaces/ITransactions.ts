export type TransactionsPayload = {
  productId: string;
  transactionId: string;
  currency: string;
  buyer_id: string;
  type: string;
  amount: string;
  project_buyer_id: string;
  email: string;
};

export type SessionPayload = {
  plan_name: string;
  price_id: string;
  success_url: string;
};

export interface ITransaction {
  id: number;
  transactionId: string;
  productId: number | null;
  amount: string;
  currency: string;
  type: string;
  buyer_id: string;
  project_buyer_id: string;
  seller_id: number | null;
  createdAt: string;
  updatedAt: string;
}