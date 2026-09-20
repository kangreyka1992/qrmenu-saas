import { createClient } from '@/lib/supabase/server'

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled'

export interface Subscription {
  id: string
  user_id: string
  plan: string
  status: SubscriptionStatus
  trial_ends_at: string | null
  current_period_ends_at: string | null
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data
}

export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId)
  if (!sub) return false

  const now = new Date()

  if (sub.status === 'trial' && sub.trial_ends_at) {
    return new Date(sub.trial_ends_at) > now
  }

  if (sub.status === 'active' && sub.current_period_ends_at) {
    return new Date(sub.current_period_ends_at) > now
  }

  return false
}

export async function getTrialDaysLeft(userId: string): Promise<number> {
  const sub = await getSubscription(userId)
  if (!sub || sub.status !== 'trial' || !sub.trial_ends_at) return 0

  const now = new Date()
  const trialEnd = new Date(sub.trial_ends_at)
  const diffMs = trialEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}