"use client"
import { CouponsTable } from "./coupons-table";
import CreateNewCouponModal from "./create-new-coupon-modal";
import ActiveAndExpiredCoupons from "./active-and-expired-coupons";

export default function Coupons () {
  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Cupons</h2>
      </div>

      <div
        className="grid grid-cols-2"
      >
        <div>
          <CreateNewCouponModal />
        </div>

        <ActiveAndExpiredCoupons />
      </div>
      
      <CouponsTable />
    </div>
  )
}