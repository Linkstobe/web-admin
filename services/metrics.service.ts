import { IMetric } from "@/interfaces/IMetrics"
import { Api } from "@/provider"

export const MetricsServices = {
  async onGetAllMetrics () {
    const { data } = await Api.get<IMetric[]>(`/metrics`)
    return data
  },
  async onGetMetricById (id: string | number) {
    const { data } = await Api.get<IMetric>(`/metrics/${id}`)
    return data
  },
  async onGetAllMetricsByProjectId (id: string | number) {
    const { data } = await Api.get<IMetric[]>(`/metrics/project/${id}`)
    return data
  },
  async onGetAllMetricsByType (type: string) {
    const { data } = await Api.get<IMetric[]>(`/metrics/type/${type}`)
    return data
  }
}