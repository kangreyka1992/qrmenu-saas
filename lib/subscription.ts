import { createClient } from '@/lib/supabase/server'

export async function getSubscription(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!sub) return false

  // Навсегда — всегда активна
  if (sub.plan_type === 'lifetime') return true

  // Подписка — проверяем дату окончания
  if (sub.status === 'active' && sub.current_period_ends_at) {
    return new Date(sub.current_period_ends_at) > new Date()
  }

  // Триал — проверяем дату
  if (sub.status === 'trial' && sub.trial_ends_at) {
    return new Date(sub.trial_ends_at) > new Date()
  }

  return false
}

export async function getTrialDaysLeft(userId: string): Promise<number> {
  const supabase = await createClient()
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('trial_ends_at, status')
    .eq('user_id', userId)
    .single()

  if (!sub || sub.status !== 'trial' || !sub.trial_ends_at) return 0

  const diff = new Date(sub.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}