import { IComplaint } from "@/interfaces/IComplaints"
import { Api } from "@/provider"

export const ComplaintService = {
  async onGetAllComplaints () {
    const { data } = await Api.get<IComplaint>("/complaint")
    return data
  },
  async onGetComplaintById (id: string | number) {
    const { data } = await Api.get<IComplaint>(`/complaint/${id}`)
    return data
  },
}