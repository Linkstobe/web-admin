import { IMetric } from "@/interfaces/IMetrics";
import { Api } from "@/provider";

type IDateRange = {
  startDate: string;
  endDate: string;
};

export const MetricsServices = {
  async onGetAllMetrics(params?: IDateRange) {
    const { data } = await Api.get<IMetric[]>(`/metrics`, { params });
    return data;
  },
  async onGetMetricById(id: string | number) {
    const { data } = await Api.get<IMetric>(`/metrics/${id}`);
    return data;
  },
  async onGetAllMetricsByProjectId(id: string | number) {
    const { data } = await Api.get<IMetric[]>(`/metrics/project/${id}`);
    return data;
  },
  async onGetAllMetricsByType(type: string) {
    const { data } = await Api.get<IMetric[]>(`/metrics/type/${type}`);
    return data;
  },
};
