import {
  ICreateProject,
  IProject,
  IUpdateProject,
} from "@/interfaces/IProjects";
import { Api } from "../provider/Api";

export type ClickedProjectMetric = {
  name: string;
  acessos: number;
};

export type ProjectCreationMetrics = {
  total: number;
  lastWeek: number;
  lastMonth: number;
};

export const ProjectService = {
  async createNewProject(payload: ICreateProject) {
    const { data } = await Api.post<IProject>("/projects", payload);
    return data;
  },

  async updateProjectById(id: string | number, payload: IUpdateProject) {
    const { data } = await Api.patch(`/projects/${id}`, payload);
    return data;
  },

  async getProjectById(id: string | number) {
    const { data } = await Api.get<IProject>(`/projects/${id}`);
    return data;
  },

  async deleteProjectByID(id: string | number) {
    await Api.delete(`/projects/${id}`);
  },

  async disableProjectById(id: string | number) {
    await Api.delete(`/projects/${id}`);
  },
  async getFormsByProjectId(id: string | number) {
    const { data } = await Api.get(`/projects/forms/${id}`);
    return data;
  },
  async getAllProject() {
    const { data } = await Api.get<IProject[]>("/projects");
    return data;
  },
  async findClickedProjectMetrics(params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { data } = await Api.get<ClickedProjectMetric[]>(
      "/projects/metrics",
      { params }
    );
    return data;
  },
  async findClikedResume(params?: { startDate?: string; endDate?: string }) {
    const { data } = await Api.get<ProjectCreationMetrics>("/projects/resume", {
      params,
    });
    return data;
  },
};
