import { IForm } from "@/interfaces/IForms";
import { Api } from "@/provider/Api";

export const FormService = {
  async createNewForm (payload: IForm) {
    const { data } = await Api.post("/forms", payload)
    return data
  },

  async getAllForms () {
    const { data } = await Api.get<IForm[]>("/forms")
    return data
  },

  async getFormByID (id: string | number) {
    const { data } = await Api.get(`/forms/${id}`)
    return data
  },

  async updateFormById (payload: IForm, id: string | number) {
    const { data } = await Api.patch(`/forms/${id}`, payload)
    return data
  },

  async deleteFormById (id: string | number) {
    await Api.delete(`/forms/${id}`)
  }
}