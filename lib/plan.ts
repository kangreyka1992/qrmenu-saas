export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'start',
    name: 'Старт',
    price: 990,
    features: [
      '1 заведение',
      'Безлимит блюд',
      'Свой логотип',
      'QR-код для печати',
      'Обновление в реальном времени',
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    price: 2490,
    popular: true,
    features: [
      'До 3 заведений',
      'Всё из «Старт»',
      'Мультиязычность',
      'Аналитика просмотров',
      'UTM-метки',
    ],
  },
  {
    id: 'network',
    name: 'Сеть',
    price: 4990,
    features: [
      'До 10 заведений',
      'Всё из «Бизнес»',
      'Свой домен',
      'API для интеграций',
      'Приоритетная поддержка',
    ],
  },
]

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}