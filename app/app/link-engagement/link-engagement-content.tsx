import ClickedProjects from "./clicked-projects";
import ProjectEngagementCard from "./project-engagement-card";

export default async function LinkEngagementContent () {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Engajamento - Links</h1>
      </header>
      <ProjectEngagementCard />
      <ClickedProjects />
    </div>  
  )
} 