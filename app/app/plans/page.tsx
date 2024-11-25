import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PlansTable } from "./plans-table";

import CancellationReasonModal from "./cancellation-reason-modal";
import ActiveSubscription from "./active-subscriptions";
import SubscriptionConversion from "./subscription-conversion";
import PlanCancellationReason from "./plan-cancellation-reasons";

export default async function Plans () {

  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Planos</h2>
      </div>

      <div
        className="2xl:hidden"
      >
        <SubscriptionConversion 
          chartClassName="h-[400px] w-full"
        />
      </div>

      <div
        className="grid grid-cols-2 2xl:grid-cols-3 gap-4"
      >
        <ActiveSubscription />

        <SubscriptionConversion 
          className="hidden 2xl:block"
          chartClassName="h-[400px]"
        />

        <PlanCancellationReason />        
      </div>

      <div>
        <PlansTable />
      </div>
    </div>
  )
}