'use client'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_PROGRAMS, MOCK_PARTNERS, MOCK_LOYALTY, MOCK_CUSTOMERS, MOCK_PAYOUTS } from './mock'
import type { Program, Partner, LoyaltyProgram, LoyaltyCustomer, Payout } from './types'

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    setPrograms(load('dt-ref-programs', MOCK_PROGRAMS))
  }, [])

  const createProgram = useCallback((data: Omit<Program, 'id' | 'created_at' | 'stats' | 'daily'>) => {
    const newProg: Program = {
      ...data, id: 'prog_' + uid(),
      created_at: new Date().toISOString(),
      stats: { total_clicks: 0, total_conversions: 0, total_revenue: 0, total_commission: 0, active_partners: 0, conversion_rate: 0, pending_commission: 0 },
      daily: [],
    }
    setPrograms(prev => {
      const next = [...prev, newProg]
      save('dt-ref-programs', next)
      return next
    })
    return newProg
  }, [])

  const updateProgram = useCallback((id: string, patch: Partial<Program>) => {
    setPrograms(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...patch } : p)
      save('dt-ref-programs', next)
      return next
    })
  }, [])

  const deleteProgram = useCallback((id: string) => {
    setPrograms(prev => {
      const next = prev.filter(p => p.id !== id)
      save('dt-ref-programs', next)
      return next
    })
  }, [])

  return { programs, createProgram, updateProgram, deleteProgram }
}

export function usePartners(programId?: string) {
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    const all = load('dt-ref-partners', MOCK_PARTNERS)
    setPartners(programId ? all.filter((p: Partner) => p.program_id === programId) : all)
  }, [programId])

  const invitePartner = useCallback((data: { name: string; email: string; program_id: string; program_slug: string }) => {
    const code = data.program_slug + '-' + uid().slice(0, 5)
    const partner: Partner = {
      id: 'part_' + uid(), program_id: data.program_id,
      name: data.name, email: data.email, code, promo_code: undefined, vanity: undefined,
      status: 'pending', joined_at: new Date().toISOString(), tier: 'standard', notes: '',
      stats: { clicks: 0, unique_clicks: 0, conversions: 0, revenue: 0, commission: 0, pending_commission: 0, paid_commission: 0, conversion_rate: 0 },
      daily: [],
    }
    setPartners(prev => {
      const allCurrent = load('dt-ref-partners', MOCK_PARTNERS)
      const next = [...allCurrent, partner]
      save('dt-ref-partners', next)
      return programId ? next.filter(p => p.program_id === programId) : next
    })
    return partner
  }, [programId])

  const updatePartner = useCallback((id: string, patch: Partial<Partner>) => {
    const allCurrent = load('dt-ref-partners', MOCK_PARTNERS)
    const next = allCurrent.map((p: Partner) => p.id === id ? { ...p, ...patch } : p)
    save('dt-ref-partners', next)
    setPartners(programId ? next.filter((p: Partner) => p.program_id === programId) : next)
  }, [programId])

  return { partners, invitePartner, updatePartner }
}

export function useLoyalty() {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([])

  useEffect(() => {
    setPrograms(load('dt-loy-programs', MOCK_LOYALTY))
  }, [])

  const createProgram = useCallback((data: Omit<LoyaltyProgram, 'id' | 'created_at' | 'stats'>) => {
    const prog: LoyaltyProgram = {
      ...data, id: 'loy_' + uid(), created_at: new Date().toISOString(),
      stats: { customers: 0, points_issued: 0, points_redeemed: 0, avg_balance: 0, total_cashback_paid: 0, total_spend: 0 },
    }
    setPrograms(prev => { const next = [...prev, prog]; save('dt-loy-programs', next); return next })
    return prog
  }, [])

  return { programs, createProgram }
}

export function useCustomers(loyaltyId?: string) {
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([])

  useEffect(() => {
    const all = load('dt-loy-customers', MOCK_CUSTOMERS)
    setCustomers(loyaltyId ? all.filter((c: LoyaltyCustomer) => c.program_id === loyaltyId) : all)
  }, [loyaltyId])

  const addCustomer = useCallback((data: { name: string; phone?: string; email?: string; program_id: string }) => {
    const cust: LoyaltyCustomer = {
      id: 'cust_' + uid(), name: data.name, phone: data.phone || '', email: data.email, program_id: data.program_id,
      card_number: 'LYL-' + Math.floor(Math.random() * 9000 + 1000),
      tier: 'Базовый', points: 0, total_spend: 0, total_points_earned: 0, total_points_redeemed: 0,
      joined_at: new Date().toISOString(), last_activity: new Date().toISOString(),
    }
    const all = load('dt-loy-customers', MOCK_CUSTOMERS)
    const next = [...all, cust]
    save('dt-loy-customers', next)
    setCustomers(loyaltyId ? next.filter((c: LoyaltyCustomer) => c.program_id === loyaltyId) : next)
    return cust
  }, [loyaltyId])

  const addPoints = useCallback((customerId: string, points: number, spend: number = 0) => {
    const all = load('dt-loy-customers', MOCK_CUSTOMERS)
    const next = all.map((c: LoyaltyCustomer) => {
      if (c.id !== customerId) return c
      const newPoints = c.points + points
      const newSpend = c.total_spend + spend
      let tier = c.tier
      if (newSpend >= 150000) tier = 'Платина'
      else if (newSpend >= 50000) tier = 'Золото'
      else if (newSpend >= 10000) tier = 'Серебро'
      return { ...c, points: newPoints, total_spend: newSpend, total_points_earned: (c.total_points_earned || 0) + points, tier, last_activity: new Date().toISOString() }
    })
    save('dt-loy-customers', next)
    setCustomers(loyaltyId ? next.filter((c: LoyaltyCustomer) => c.program_id === loyaltyId) : next)
  }, [loyaltyId])

  const redeemPoints = useCallback((customerId: string, points: number) => {
    const all = load('dt-loy-customers', MOCK_CUSTOMERS)
    const next = all.map((c: LoyaltyCustomer) =>
      c.id === customerId ? { ...c, points: Math.max(0, c.points - points), total_points_redeemed: (c.total_points_redeemed || 0) + points, last_activity: new Date().toISOString() } : c
    )
    save('dt-loy-customers', next)
    setCustomers(loyaltyId ? next.filter((c: LoyaltyCustomer) => c.program_id === loyaltyId) : next)
  }, [loyaltyId])

  return { customers, addCustomer, addPoints, redeemPoints }
}

export function usePayouts() {
  const [payouts] = useState<Payout[]>(() => load('dt-ref-payouts', MOCK_PAYOUTS))
  return { payouts }
}

export function getPartnerByCode(code: string): Partner | undefined {
  const all = load('dt-ref-partners', MOCK_PARTNERS)
  return all.find((p: Partner) => p.code === code || p.vanity === code)
}

export function getProgramById(id: string): Program | undefined {
  const all = load('dt-ref-programs', MOCK_PROGRAMS)
  return all.find((p: Program) => p.id === id)
}
