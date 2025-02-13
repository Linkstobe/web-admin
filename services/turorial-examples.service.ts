import { ITutorialExamples, IUpdateTutorialExamples } from "@/interfaces/ITutorialExamples"
import { Api } from "@/provider"

export const TutorialExamplesService = {
  async getAll() {
    const { data } = await Api.get<ITutorialExamples[]>(
      '/tutorial-examples', 
      { baseURL: "https://srv538807.hstgr.cloud" }
    )
    return data
  },

  async updateTutorialExampleById (id: string | number, payload:IUpdateTutorialExamples) {
    const { data } = await Api.patch(
      `/tutorial-examples/${id}`, 
      payload,
      { baseURL: "https://srv538807.hstgr.cloud" }
    )

    return data
  }
}