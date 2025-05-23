import { ICreatePanel, IPainel } from "@/interfaces/IPanels";
import { Api } from "@/provider/Api";

type IDateRange = {
  startDate: string;
  endDate: string;
};

export const PainelService = {
  async createNewPainel(payload: ICreatePanel) {
    const { data } = await Api.post<IPainel>("/painels", payload);
    return data;
  },

  async getPainelsMetrics(params?: IDateRange) {
    const { data } = await Api.get("/painels/metrics", { params });
    return data;
  },

  async getPainelById(id: string | number) {
    const { data } = await Api.get<IPainel>(`/painels/${id}`);
    return data;
  },

  async onGetAllPanels() {
    const { data } = await Api.get<IPainel[]>("/painels");
    return data;
  },

  async getPainelByProjectId(projectId: string | number) {
    const { data } = await Api.get<IPainel[]>(`/painels/project/${projectId}`);
    return data;
  },

  async updatePainelById(id: string | number, payload: IPainel) {
    const { data } = await Api.patch<IPainel>(`/painels/${id}`, payload);
    return data;
  },

  async deleteById(id: string | number) {
    await Api.delete(`/painels/${id}`);
  },
};
