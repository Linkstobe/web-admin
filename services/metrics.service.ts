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
  async onGetAllMetricsByType(
    type: string,
    startDate?: string,
    endDate?: string
  ) {
    const url = new URL(`/metrics/type/${type}`, Api.defaults.baseURL);
    if (startDate) url.searchParams.append("start", startDate);
    if (endDate) url.searchParams.append("end", endDate);

    const { data } = await Api.get<IMetric[]>(url.pathname + url.search);

    return data;
  },
};
