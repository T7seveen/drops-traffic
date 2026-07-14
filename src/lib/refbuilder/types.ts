export type CommissionType = 'percent' | 'fixed'
export type ProgramStatus = 'active' | 'paused' | 'draft'
export type PartnerStatus = 'pending' | 'active' | 'suspended'
export type ConversionStatus = 'pending' | 'approved' | 'paid' | 'rejected'
export type LoyaltyTierName = 'Базовый' | 'Серебро' | 'Золото' | 'Платина'

export type DayStats = { date: string; clicks: number; conversions: number; revenue: number }

export type Program = {
  id: string
  name: string
  slug: string
  description: string
  commission_type: CommissionType
  commission_value: number
  hold_days: number
  max_partners: number | null
  cookie_days: number
  status: ProgramStatus
  created_at: string
  tier2_enabled: boolean
  tier2_commission: number
  webhook_url: string
  promo_code_enabled: boolean
  vanity_links_enabled: boolean
  stats: {
    total_clicks: number
    total_conversions: number
    total_revenue: number
    total_commission: number
    active_partners: number
    conversion_rate: number
    pending_commission: number
  }
  daily: DayStats[]
}

export type Partner = {
  id: string
  program_id: string
  name: string
  email: string
  code: string
  vanity?: string
  promo_code?: string
  status: PartnerStatus
  joined_at: string
  tier: 'standard' | 'top' | 'vip'
  notes: string
  stats: {
    clicks: number
    unique_clicks: number
    conversions: number
    revenue: number
    commission: number
    pending_commission: number
    paid_commission: number
    conversion_rate: number
  }
  daily: DayStats[]
}

export type Conversion = {
  id: string
  partner_id: string
  program_id: string
  order_id: string
  order_value: number
  commission: number
  status: ConversionStatus
  created_at: string
  approved_at?: string
}

export type LoyaltyTier = {
  name: LoyaltyTierName
  min_spend: number
  color: string
  cashback_bonus: number
  benefits: string[]
  multiplier?: number
  discount_percent?: number
}

export type LoyaltyProgram = {
  id: string
  name: string
  description: string
  type: 'points' | 'cashback'
  points_per_100_rub: number
  rub_per_point: number
  cashback_percent: number
  min_redeem_points: number
  point_expiry_days: number | null
  status: 'active' | 'paused'
  created_at: string
  tiers: LoyaltyTier[]
  stats: {
    customers: number
    points_issued: number
    points_redeemed: number
    avg_balance: number
    total_cashback_paid: number
    total_spend: number
  }
}

export type LoyaltyCustomer = {
  id: string
  program_id: string
  name: string
  phone: string
  email?: string
  card_number: string
  tier: LoyaltyTierName
  points: number
  total_spend: number
  total_points_earned: number
  total_points_redeemed: number
  joined_at: string
  last_activity: string
}

export type Payout = {
  id: string
  partner_id: string
  partner_name: string
  program_id: string
  amount: number
  status: 'pending' | 'processing' | 'paid' | 'failed'
  method: 'card' | 'sbp' | 'telegram'
  created_at: string
  paid_at?: string
  details?: string
}
