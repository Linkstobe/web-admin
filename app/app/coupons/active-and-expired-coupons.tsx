import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponService } from "@/services/coupons.service";
import { useEffect, useState } from "react";

interface CouponMetric {
  actives: number
  expireds: number
}

export default function ActiveAndExpiredCoupons () {
  const [couponMetric, setCouponMetric] = useState<CouponMetric>({
    actives: 0,
    expireds: 0
  })

  useEffect(() => {
    const getAllCoupons = async () => {
      const coupons = await CouponService.getAllCoupons()
      const activeCoupons = coupons.filter(({ active }) => active)
      setCouponMetric(prev => ({
        ...prev,
        actives: activeCoupons.length
      }))
    }

    getAllCoupons()
  }, [])

  return (
    <div
      className="grid grid-cols-2 gap-3"
    >
      <Card
        className="shadow-lg"
      >
        <CardHeader>
          <CardTitle>
            Cupons ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="text-6xl text-center font-[800]"
          >
            { couponMetric.actives }
          </p>
        </CardContent>
      </Card>
      <Card
        className="shadow-lg bg-[#299FC7]"
      >
        <CardHeader>
          <CardTitle
            className="text-white"
          >
            Cupons expirados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p 
            className="text-6xl text-center font-[800] text-white"
          >
            { couponMetric.expireds }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}