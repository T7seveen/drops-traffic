import type { Program, Partner, LoyaltyProgram, LoyaltyCustomer, Payout } from './types'

function days(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    const clicks = Math.floor(Math.random() * 80 + 20)
    const conversions = Math.floor(clicks * (Math.random() * 0.08 + 0.04))
    const revenue = conversions * (Math.random() * 1500 + 800)
    return { date: d.toISOString().slice(0, 10), clicks, conversions, revenue: Math.round(revenue) }
  })
}

export const MOCK_PROGRAMS: Program[] = [
  {
    id: 'prog_1',
    name: 'Основная партнёрская программа',
    slug: 'main',
    description: 'Рекомендуйте наш магазин и получайте 10% с каждого заказа',
    commission_type: 'percent',
    commission_value: 10,
    hold_days: 14,
    max_partners: null,
    cookie_days: 60,
    status: 'active',
    created_at: '2025-03-01T10:00:00Z',
    tier2_enabled: true,
    tier2_commission: 3,
    webhook_url: '',
    promo_code_enabled: true,
    vanity_links_enabled: true,
    stats: {
      total_clicks: 12847,
      total_conversions: 634,
      total_revenue: 1284700,
      total_commission: 128470,
      active_partners: 23,
      conversion_rate: 4.9,
      pending_commission: 18200,
    },
    daily: days(30),
  },
  {
    id: 'prog_2',
    name: 'Блогеры и инфлюенсеры',
    slug: 'bloggers',
    description: 'Специальные условия для авторов с аудиторией от 5000',
    commission_type: 'percent',
    commission_value: 15,
    hold_days: 7,
    max_partners: 50,
    cookie_days: 90,
    status: 'active',
    created_at: '2025-05-15T10:00:00Z',
    tier2_enabled: false,
    tier2_commission: 0,
    webhook_url: '',
    promo_code_enabled: true,
    vanity_links_enabled: true,
    stats: {
      total_clicks: 5321,
      total_conversions: 198,
      total_revenue: 495000,
      total_commission: 74250,
      active_partners: 11,
      conversion_rate: 3.7,
      pending_commission: 9400,
    },
    daily: days(30),
  },
  {
    id: 'prog_3',
    name: 'Оптовым покупателям',
    slug: 'wholesale',
    description: 'Фиксированное вознаграждение за каждого приведённого клиента',
    commission_type: 'fixed',
    commission_value: 500,
    hold_days: 30,
    max_partners: 20,
    cookie_days: 120,
    status: 'paused',
    created_at: '2025-06-01T10:00:00Z',
    tier2_enabled: false,
    tier2_commission: 0,
    webhook_url: '',
    promo_code_enabled: false,
    vanity_links_enabled: false,
    stats: {
      total_clicks: 892,
      total_conversions: 34,
      total_revenue: 340000,
      total_commission: 17000,
      active_partners: 7,
      conversion_rate: 3.8,
      pending_commission: 2500,
    },
    daily: days(30),
  },
]

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'part_1', program_id: 'prog_1', name: 'Мария Соколова', email: 'maria@example.com',
    code: 'main-m4r14', vanity: 'maria-shop', promo_code: 'MARIA10', status: 'active',
    joined_at: '2025-03-10T10:00:00Z', tier: 'vip', notes: 'Топ-блогер, 80K подписчиков',
    stats: { clicks: 3420, unique_clicks: 2810, conversions: 187, revenue: 374000, commission: 37400, pending_commission: 5200, paid_commission: 32200, conversion_rate: 5.5 },
    daily: days(30),
  },
  {
    id: 'part_2', program_id: 'prog_1', name: 'Алексей Петров', email: 'alex@example.com',
    code: 'main-4l3x7', vanity: undefined, promo_code: 'ALEX10', status: 'active',
    joined_at: '2025-04-02T10:00:00Z', tier: 'top', notes: '',
    stats: { clicks: 2140, unique_clicks: 1890, conversions: 124, revenue: 248000, commission: 24800, pending_commission: 3100, paid_commission: 21700, conversion_rate: 5.8 },
    daily: days(30),
  },
  {
    id: 'part_3', program_id: 'prog_1', name: 'Дропшип ТМ', email: 'dropship@tm.ru',
    code: 'main-dr0p5', vanity: 'dropship-tm', promo_code: undefined, status: 'active',
    joined_at: '2025-04-20T10:00:00Z', tier: 'standard', notes: '',
    stats: { clicks: 1830, unique_clicks: 1540, conversions: 89, revenue: 178000, commission: 17800, pending_commission: 2400, paid_commission: 15400, conversion_rate: 4.9 },
    daily: days(30),
  },
  {
    id: 'part_4', program_id: 'prog_1', name: 'Telegram: @ecomtips', email: 'ecomtips@tg.ru',
    code: 'main-ecom1', vanity: 'ecomtips', promo_code: 'ECOM10', status: 'active',
    joined_at: '2025-05-01T10:00:00Z', tier: 'standard', notes: 'Telegram канал 15K',
    stats: { clicks: 980, unique_clicks: 820, conversions: 41, revenue: 82000, commission: 8200, pending_commission: 1100, paid_commission: 7100, conversion_rate: 4.2 },
    daily: days(30),
  },
  {
    id: 'part_5', program_id: 'prog_1', name: 'Иван Новиков', email: 'ivan@novikov.ru',
    code: 'main-1v4n9', vanity: undefined, promo_code: undefined, status: 'pending',
    joined_at: '2025-07-10T10:00:00Z', tier: 'standard', notes: '',
    stats: { clicks: 0, unique_clicks: 0, conversions: 0, revenue: 0, commission: 0, pending_commission: 0, paid_commission: 0, conversion_rate: 0 },
    daily: days(30),
  },
  {
    id: 'part_6', program_id: 'prog_2', name: 'ВКонтакте: StyleBlog', email: 'style@vk.ru',
    code: 'bloggers-st1l3', vanity: 'styleblog', promo_code: 'STYLE15', status: 'active',
    joined_at: '2025-05-20T10:00:00Z', tier: 'top', notes: 'VK 45K подписчиков',
    stats: { clicks: 2100, unique_clicks: 1760, conversions: 78, revenue: 195000, commission: 29250, pending_commission: 4200, paid_commission: 25050, conversion_rate: 3.7 },
    daily: days(30),
  },
]

export const MOCK_LOYALTY: LoyaltyProgram[] = [
  {
    id: 'loy_1',
    name: 'Клубная карта MyShop',
    description: 'Начисляйте бонусы за каждую покупку и обменивайте на скидки',
    type: 'points',
    points_per_100_rub: 5,
    rub_per_point: 20,
    cashback_percent: 0,
    min_redeem_points: 100,
    point_expiry_days: 365,
    status: 'active',
    created_at: '2025-02-01T10:00:00Z',
    tiers: [
      { name: 'Базовый', min_spend: 0, color: '#94A3B8', cashback_bonus: 0, multiplier: 1, discount_percent: 0, benefits: ['5 бонусов за 100 ₽', 'Доступ к акциям'] },
      { name: 'Серебро', min_spend: 10000, color: '#64748B', cashback_bonus: 1, multiplier: 1.5, discount_percent: 3, benefits: ['7 бонусов за 100 ₽', 'Приоритетная поддержка', 'Ранний доступ к распродажам'] },
      { name: 'Золото', min_spend: 50000, color: '#F59E0B', cashback_bonus: 3, multiplier: 2, discount_percent: 5, benefits: ['10 бонусов за 100 ₽', 'Бесплатная доставка', 'Персональный менеджер'] },
      { name: 'Платина', min_spend: 150000, color: '#6366F1', cashback_bonus: 5, multiplier: 3, discount_percent: 10, benefits: ['15 бонусов за 100 ₽', 'Кешбэк 5%', 'VIP-поддержка 24/7', 'Эксклюзивные предложения'] },
    ],
    stats: { customers: 847, points_issued: 284700, points_redeemed: 127400, avg_balance: 188, total_cashback_paid: 6370, total_spend: 16940000 },
  },
  {
    id: 'loy_2',
    name: 'Кешбэк-программа Premium',
    description: 'Автоматический кешбэк 3% на каждую покупку',
    type: 'cashback',
    points_per_100_rub: 0,
    rub_per_point: 1,
    cashback_percent: 3,
    min_redeem_points: 0,
    point_expiry_days: null,
    status: 'active',
    created_at: '2025-06-01T10:00:00Z',
    tiers: [
      { name: 'Базовый', min_spend: 0, color: '#A3E635', cashback_bonus: 3, multiplier: 1, discount_percent: 0, benefits: ['Кешбэк 3% на всё'] },
      { name: 'Золото', min_spend: 30000, color: '#F59E0B', cashback_bonus: 5, multiplier: 1, discount_percent: 0, benefits: ['Кешбэк 5%', 'Без срока действия'] },
    ],
    stats: { customers: 312, points_issued: 0, points_redeemed: 0, avg_balance: 0, total_cashback_paid: 42600, total_spend: 1420000 },
  },
]

export const MOCK_CUSTOMERS: LoyaltyCustomer[] = [
  { id: 'cust_1', program_id: 'loy_1', name: 'Анна Ковалёва', phone: '+7 (900) 123-45-67', email: 'anna@mail.ru', card_number: 'LYL-0001', tier: 'Золото', points: 3420, total_spend: 68400, total_points_earned: 34200, total_points_redeemed: 30780, joined_at: '2025-02-10T10:00:00Z', last_activity: '2026-07-10T10:00:00Z' },
  { id: 'cust_2', program_id: 'loy_1', name: 'Дмитрий Смирнов', phone: '+7 (916) 234-56-78', email: undefined, card_number: 'LYL-0002', tier: 'Серебро', points: 1840, total_spend: 36800, total_points_earned: 18400, total_points_redeemed: 16560, joined_at: '2025-03-05T10:00:00Z', last_activity: '2026-07-08T10:00:00Z' },
  { id: 'cust_3', program_id: 'loy_1', name: 'Елена Орлова', phone: '+7 (926) 345-67-89', email: 'elena@gmail.com', card_number: 'LYL-0003', tier: 'Платина', points: 7200, total_spend: 184000, total_points_earned: 92000, total_points_redeemed: 84800, joined_at: '2025-02-15T10:00:00Z', last_activity: '2026-07-12T10:00:00Z' },
  { id: 'cust_4', program_id: 'loy_1', name: 'Сергей Волков', phone: '+7 (903) 456-78-90', email: undefined, card_number: 'LYL-0004', tier: 'Базовый', points: 340, total_spend: 6800, total_points_earned: 340, total_points_redeemed: 0, joined_at: '2026-01-20T10:00:00Z', last_activity: '2026-06-30T10:00:00Z' },
  { id: 'cust_5', program_id: 'loy_1', name: 'Наталья Морозова', phone: '+7 (985) 567-89-01', email: 'nat@yandex.ru', card_number: 'LYL-0005', tier: 'Серебро', points: 2100, total_spend: 42000, total_points_earned: 21000, total_points_redeemed: 18900, joined_at: '2025-04-01T10:00:00Z', last_activity: '2026-07-11T10:00:00Z' },
]

export const MOCK_PAYOUTS: Payout[] = [
  { id: 'pay_1', partner_id: 'part_1', partner_name: 'Мария Соколова', program_id: 'prog_1', amount: 15200, status: 'paid', method: 'sbp', created_at: '2026-07-01T10:00:00Z', paid_at: '2026-07-01T14:30:00Z' },
  { id: 'pay_2', partner_id: 'part_2', partner_name: 'Алексей Петров', program_id: 'prog_1', amount: 8400, status: 'paid', method: 'card', created_at: '2026-07-01T10:00:00Z', paid_at: '2026-07-01T15:10:00Z' },
  { id: 'pay_3', partner_id: 'part_3', partner_name: 'Дропшип ТМ', program_id: 'prog_1', amount: 6100, status: 'processing', method: 'sbp', created_at: '2026-07-12T10:00:00Z' },
  { id: 'pay_4', partner_id: 'part_6', partner_name: 'ВКонтакте: StyleBlog', program_id: 'prog_2', amount: 11200, status: 'pending', method: 'telegram', created_at: '2026-07-13T10:00:00Z' },
]
