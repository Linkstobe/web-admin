import { ITransaction, SessionPayload, TransactionsPayload } from "@/interfaces/ITransactions";
import { Api } from "@/provider";


export const TransactionService = {
  async createTransaction(payload: TransactionsPayload) {
    const { data } = await Api.post("/transactions", payload);
    return data;
  },

  async onGetClientSecret(payload: { amount: number; currency: string }) {
    const { data } = await Api.post("/stripe", payload);
    return data;
  },

  async onGetSession(id: string) {
    const { data } = await Api.get(`/stripe/session/${id}`);
    return data;
  },

  async createSession(payload: SessionPayload) {
    const { data } = await Api.post("/stripe/session", payload);
    return data;
  },

  async onCancelPlan(sub_id: string) {
    const { data } = await Api.post(`/stripe/cancel/${sub_id}`);
    return data;
  },

  async createSessionDesigner(payload: SessionPayload) {
    const { data } = await Api.post("/stripe/session/designer", payload);
    return data;
  },

  async onGetAllTransactions() {
    const { data } = await Api.get<ITransaction[]>("/transactions");
    return data;
  },
  async onGetTransactionsByUserId(id: string | number) {
    const { data } = await Api.get(`/transactions/user/${id}`);
    return data;
  },
};