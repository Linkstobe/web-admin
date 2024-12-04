import { getCookie } from "@/lib/auth";
import ReportedProjectsTable from "./reported-projects-table";
import { IComplaint } from "@/interfaces/IComplaints";
import { IUser } from "@/interfaces/IUser";
import { IProject } from "@/interfaces/IProjects";
import ReportedProjectsContent from "./reported-projects-content";

export default async function ReportedProjects () {
  const token = getCookie("authToken")

  let allComplaints: IComplaint[] = []
  let allUsers: IUser[] = []
  let allProjects: IProject[] = []

  try {
    const complaintUrl = `${process.env.NEXT_PUBLIC_API_URL}/complaint`
    const projectsUrl = `${process.env.NEXT_PUBLIC_API_URL}/projects`
    const usersUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`

    const [complaintsResponse, projectsResponse, usersResponse] = await Promise.all([
      fetch(complaintUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(projectsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(usersUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])

    const requestFailed = 
      !complaintsResponse.ok ||
      !projectsResponse.ok ||
      !usersResponse.ok

    if (requestFailed) {
      throw new Error("Falha em uma ou mais requisições");
    }

    const [complaints, projects, users]: [IComplaint[], IProject[], IUser[]] = await Promise.all([
      complaintsResponse.json(),
      projectsResponse.json(),
      usersResponse.json()
    ])

    allComplaints = complaints
    allProjects = projects
    allUsers = users

  } catch (error) {
    console.log("ReportedProjects: ", error)
  }

  return (
    <ReportedProjectsContent 
      complaints={allComplaints}
      projects={allProjects}
      users={allUsers}
    />
  )
}