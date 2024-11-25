
import { ICancellationReason, ICreateCancellationReason } from "@/interfaces/ICancellationReasons";
import { Api } from "../provider";

export const CancellationReasonService = {
  async onGetCancellationReasonById (id: string | number) {
    const { data } = await Api.get<ICancellationReason>(`/cancellation-reasons/${id}`)
    return data
  },

  async onGetCancellationReasonsByProjectId (id: string | number) {
    const { data } = await Api.get<ICancellationReason>(`/cancelation-reasons/project/${id}`)
    return data
  },

  async onGetAllCancellationReasons () {
    const { data } = await Api.get<ICancellationReason>("/")
    return data
  },
  
  async onCreateNewCancellationReason (payload: ICreateCancellationReason) {
    const { data } = await Api.post<ICancellationReason>("/cancellation-reasons/")
    return data
  },

  async onUpdateCancellationReason (id: string | number, payload: ICancellationReason) {
    await Api.patch(`/cancellation-reasons/${id}`, payload)
  },

  async onDeleteCancellationReason (id: string | number) {
    await Api.delete(`/cancellation-reasons/${id}`)
  },
}