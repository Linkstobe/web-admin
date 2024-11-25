import ReportedProjectsTable from "./reported-projects-table";

export default function ReportedProjects () {
  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div>
        <ReportedProjectsTable />
      </div>
    </div>
  )
}