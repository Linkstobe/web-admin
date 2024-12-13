import { getCookie } from "@/lib/auth";
import LinkEngagementContent from "./link-engagement-content";
import { IProject } from "@/interfaces/IProjects";
import { IMetric } from "@/interfaces/IMetrics";
import { IPainel } from "@/interfaces/IPanels";
import { IUser } from "@/interfaces/IUser";

export default async function LinkEngagement () {
  const token = getCookie("authToken")

  let projectAccessMetrics: IMetric[] = []
  let panelClicksMetrics: IMetric[] = []

  let allProjects: IProject[] = []
  let allPanels: IPainel[] = []
  let allUsers: IUser[] = []

  try {
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;
    const metricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics`;
    const panelsUrl = `${process.env.NEXT_PUBLIC_API_URL}/painels`;
    const usersUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`;

    const accessMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/origin:`;
    const panelLinkClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-link:`;
    const panelBasicClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-basic:`;
    const panelAdvancedClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-advanced:`;

    const [
      projectsResponse,
      // metricsResponse,
      panelsResponse,
      usersResponse,
      accessResponse,
      panelLinkClicksResponse,
      panelBasicClicksResponse,
      panelAdvancedClicksResponse
    ] = await Promise.all([
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      // fetch(metricsUrl, {
      //   headers: { Authorization: `Bearer ${token}` }
      // }),
      fetch(panelsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(usersUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(accessMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(panelLinkClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(panelBasicClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(panelAdvancedClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    ])

    const requestFailed = 
      !projectsResponse.ok ||
      // !metricsResponse.ok ||
      !panelsResponse.ok ||
      !usersResponse.ok ||
      !accessResponse.ok ||
      !panelLinkClicksResponse.ok ||
      !panelBasicClicksResponse.ok ||
      !panelAdvancedClicksResponse.ok
    
    if (requestFailed) {
      throw new Error("Falha em uma ou mais requisições");
    }

    const [projects, panels, users, access, panelLinkClicks, panelBasicClicks, panelAdvancedClicks]: 
    [IProject[], IPainel[], IUser[], IMetric[], IMetric[], IMetric[], IMetric[]] = await Promise.all([
      projectsResponse.json(),
      // metricsResponse.json(),
      panelsResponse.json(),
      usersResponse.json(),
      accessResponse.json(),
      panelLinkClicksResponse.json(),
      panelBasicClicksResponse.json(),
      panelAdvancedClicksResponse.json()
    ])

    allProjects = projects
    allPanels = panels
    allUsers = users
    projectAccessMetrics = access
    panelClicksMetrics = [...panelLinkClicks, ...panelBasicClicks, ...panelAdvancedClicks]

    // metrics.forEach((metric) => {
    //   const { link_type } = metric

    //   const isAccessMetric = link_type.startsWith("origin:")
    //   const isPanelClickMetric =
    //     link_type.startsWith("click:panel-link") || 
    //     link_type.startsWith("click:panel-basic") || 
    //     link_type.startsWith("click:panel-advanced")

    //   if (isAccessMetric) {
    //     projectAccessMetrics.push(metric)
    //   } else if (isPanelClickMetric) {
    //     panelClicksMetrics.push(metric)
    //   }
    // })

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