import AverageTimeOnPage from "./average-time-on-page";
import ClickThroughRate from "./click-through-rate";
import ClickedProjects from "./clicked-projects";
import EngagementFunnel from "./engagement-funnel";
import NewLinkSourceTable from "./new-link-source-table";
import ProjectEngagementCard from "./project-engagement-card";

export default function LinkEngagement () {
  return (
   <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Engajamento - Projetos</h2>
      </div>

      <ProjectEngagementCard />

      <div
        className="grid grid-cols-[2fr_1fr] gap-4"
      >
        <div>
          <ClickedProjects />
        </div>

        <div
          className="h-full"
        >
          <EngagementFunnel />
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <AverageTimeOnPage />
        </div>

        <div>
          <ClickThroughRate />
        </div>
      </div>

      <div>
        <NewLinkSourceTable />
      </div>

    </div> 
  )
}