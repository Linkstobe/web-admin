export interface ICoupon {
  coupon_name: string
  percent_off?: number
  amount_off?: number
  duration: 'once' | 'repeating' | 'forever'
  duration_in_months?: number
  max_redemptions?: number
  redeem_by?: number
  currency?: string
}