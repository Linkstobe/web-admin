import { ICoupon } from "@/interfaces/ICoupons";
import { Api } from "@/provider";

export const CouponService = {
  async createNewCoupon (payload: ICoupon) {
    const { data } = await Api.post("/stripe/coupon", payload)
    return data
  },
  async getAllCoupons () {
    const { data } = await Api.get("/stripe/coupon")
    return data
  },
  async disableCouponByPromotionId (promotionId: string) {
    const { data } = await Api.post(`stripe/coupon/${promotionId}/disable`)
    return data
  }
}