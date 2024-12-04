import { IComplaint } from "@/interfaces/IComplaints";
import ReportedProjectsTable from "./reported-projects-table";
import { IProject } from "@/interfaces/IProjects";
import { IUser } from "@/interfaces/IUser";

interface ReportedProjectsContentProps {
  complaints: IComplaint[]
  projects: IProject[]
  users: IUser[]
}

export default function ReportedProjectsContent ({
  complaints,
  projects,
  users
}: ReportedProjectsContentProps) {
  
  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div>
        <ReportedProjectsTable 
          complaints={complaints}
          projects={projects}
          users={users}
        />
      </div>
    </div>
  )
}