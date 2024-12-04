import { getCookie } from "@/lib/auth";
import FormsContent from "./forms-content";
import { IMetric } from "@/interfaces/IMetrics";
import { IForm } from "@/interfaces/IForms";
import { IProject } from "@/interfaces/IProjects";

export default async function Forms () {
  const token = getCookie("authToken")

  const formClicksMetrics: IMetric[] = []
  const formAccessMetrics: IMetric[] = []

  let allProjects: IProject[] = []
  let allForms: IForm[] = [] 

  try {
    const formsUrl = `${process.env.NEXT_PUBLIC_API_URL}/forms`;
    const metricsUrl = `${process.env.NEXT_PUBLIC_API_URL}/metrics`;
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`;

    const [formsResponse, metricsResponse, projectsResponse] = await Promise.all([
      fetch(formsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(metricsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!formsResponse.ok || !metricsResponse.ok) {
    }

    const [forms, metrics, projects]: [IForm[], IMetric[], IProject[]] = await Promise.all([
      formsResponse.json(),
      metricsResponse.json(),
      projectsResponse.json()
    ]);

    allForms = forms
    allProjects = projects

    metrics.forEach((metric) => {
      const { link_type } = metric

      if (link_type.startsWith("view:form")) {
        formAccessMetrics.push(metric)
      } else if (link_type.startsWith("click:panel-Modelo padrão-")) {
        formClicksMetrics.push(metric)
      }
    })

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