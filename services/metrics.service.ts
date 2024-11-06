import { Metric } from "@/interfaces/IMetrics"
import { Api } from "@/provider"

export const MetricsServices = {
  async onGetAllMetrics () {
    const { data } = await Api.get<Metric[]>(`/metrics`)
    return data
  },
  async onGetMetricById (id: string | number) {
    const { data } = await Api.get<Metric>(`/metrics/${id}`)
    return data
  },
  async onGetAllMetricsByProjectId (id: string | number) {
    const { data } = await Api.get<Metric[]>(`/metrics/project/${id}`)
    return data
  }
}