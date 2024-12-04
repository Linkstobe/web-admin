import { getCookie } from "@/lib/auth";
import LinkEngagementContent from "./link-engagement-content";
import { IProject } from "@/interfaces/IProjects";
import { IMetric } from "@/interfaces/IMetrics";
import { IPainel } from "@/interfaces/IPanels";
import { IUser } from "@/interfaces/IUser";

export default async function LinkEngagement () {
  const token = getCookie("authToken")

  const projectAccessMetrics: IMetric[] = []
  const panelClicksMetrics: IMetric[] = []

  let allProjects: IProject[] = []
  let allPanels: IPainel[] = []
  let allUsers: IUser[] = []

  try {
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const metricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics`;
    const panelsUrl = `${process.env.NEXT_PUBLIC_API_URL}/painels`;
    const usersUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`;

    const [
      projectsResponse,
      metricsResponse,
      panelsResponse,
      usersResponse,
    ] = await Promise.all([
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(metricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(panelsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(usersUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])

    const requestFailed = 
      !projectsResponse.ok ||
      !metricsResponse.ok ||
      !panelsResponse.ok ||
      !usersResponse.ok
    
    if (requestFailed) {
      throw new Error("Falha em uma ou mais requisições");
    }

    const [projects, metrics, panels, users]: [IProject[], IMetric[], IPainel[], IUser[]] = await Promise.all([
      projectsResponse.json(),
      metricsResponse.json(),
      panelsResponse.json(),
      usersResponse.json()
    ])

    allProjects = projects
    allPanels = panels
    allUsers = users

    metrics.forEach((metric) => {
      const { link_type } = metric

      const isAccessMetric = link_type.startsWith("origin:")
      const isPanelClickMetric =
        link_type.startsWith("click:panel-link") || 
        link_type.startsWith("click:panel-basic") || 
        link_type.startsWith("click:panel-advanced")

      if (isAccessMetric) {
        projectAccessMetrics.push(metric)
      } else if (isPanelClickMetric) {
        panelClicksMetrics.push(metric)
      }
    })

  } catch (error) {
    console.log("LinkEngagement: ", error)
  }

  return (
    <LinkEngagementContent 
      projects={allProjects}
      projectAccessMetrics={projectAccessMetrics}
      panelsClicksMetrics={panelClicksMetrics}
      panels={allPanels}
      users={allUsers}
    />
  )
}