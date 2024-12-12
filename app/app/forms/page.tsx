import { getCookie } from "@/lib/auth";
import FormsContent from "./forms-content";
import { IMetric } from "@/interfaces/IMetrics";
import { IForm } from "@/interfaces/IForms";
import { IProject } from "@/interfaces/IProjects";

export default async function Forms () {
  const token = getCookie("authToken")

  let formClicksMetrics: IMetric[] = []
  let formAccessMetrics: IMetric[] = []

  let allProjects: IProject[] = []
  let allForms: IForm[] = [] 

  try {
    const formsUrl = `${process.env.NEXT_PUBLIC_API_URL}/forms`;
    const formAccessMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/view:form`;
    const formClicksMetricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics/type/click:panel-Modelo padrão-`;
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;

    const [formsResponse, formAccessMetricsResponse, formClicksMetricsResponse, projectsResponse] = await Promise.all([
      fetch(formsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(formAccessMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(formClicksMetricsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const [forms, formAccess, formClicks, projects]: 
      [IForm[], IMetric[], IMetric[], IProject[]] = await Promise.all([
      formsResponse.json(),
      formAccessMetricsResponse.json(),
      formClicksMetricsResponse.json(),
      projectsResponse.json()
    ]);

    allForms = forms
    allProjects = projects
    formClicksMetrics = formClicks
    formAccessMetrics = formAccess

  } catch (error) {
    console.log("Forms: ", error)
  }
  return (
    <FormsContent 
      formAccessMetrics={formAccessMetrics}
      formClicksMetrics={formClicksMetrics}
      forms={allForms}
      projects={allProjects}
    />
  )
}