export interface RestaurantType {
  id: string
  name: string
  emoji: string
  description: string
  categories: {
    name: string
    icon: string
  }[]
}

export const RESTAURANT_TYPES: RestaurantType[] = [
  {
    id: 'coffee',
    name: 'Кофейня',
    emoji: '☕',
    description: 'Кофе, десерты, завтраки',
    categories: [
      { name: 'Кофе', icon: '☕' },
      { name: 'Чай и напитки', icon: '🍵' },
      { name: 'Десерты', icon: '🍰' },
      { name: 'Завтраки', icon: '🍳' },
    ],
  },
  {
    id: 'shawarma',
    name: 'Шаурмечная',
    emoji: '🌯',
    description: 'Шаурма, роллы, соусы',
    categories: [
      { name: 'Шаурма', icon: '🌯' },
      { name: 'Роллы', icon: '🌮' },
      { name: 'Соусы', icon: '🥫' },
      { name: 'Напитки', icon: '🥤' },
    ],
  },
  {
    id: 'sushi',
    name: 'Суши и роллы',
    emoji: '🍣',
    description: 'Суши, роллы, сеты',
    categories: [
      { name: 'Роллы', icon: '🍣' },
      { name: 'Суши', icon: '🍥' },
      { name: 'Сеты', icon: '🍱' },
      { name: 'Соусы', icon: '🥫' },
      { name: 'Напитки', icon: '🥤' },
    ],
  },
  {
    id: 'pizza',
    name: 'Пиццерия',
    emoji: '🍕',
    description: 'Пицца, паста, салаты',
    categories: [
      { name: 'Пицца', icon: '🍕' },
      { name: 'Паста', icon: '🍝' },
      { name: 'Салаты', icon: '🥗' },
      { name: 'Напитки', icon: '🥤' },
    ],
  },
  {
    id: 'bakery',
    name: 'Пекарня',
    emoji: '🥐',
    description: 'Выпечка, хлеб, десерты',
    categories: [
      { name: 'Выпечка', icon: '🥐' },
      { name: 'Хлеб', icon: '🍞' },
      { name: 'Десерты', icon: '🍰' },
      { name: 'Напитки', icon: '🥤' },
    ],
  },
  {
    id: 'bar',
    name: 'Бар',
    emoji: '🍺',
    description: 'Алкоголь, закуски, коктейли',
    categories: [
      { name: 'Пиво', icon: '🍺' },
      { name: 'Коктейли', icon: '🍹' },
      { name: 'Крепкий алкоголь', icon: '🥃' },
      { name: 'Закуски', icon: '🍟' },
    ],
  },
  {
    id: 'fastfood',
    name: 'Фастфуд',
    emoji: '🍔',
    description: 'Бургеры, картошка, напитки',
    categories: [
      { name: 'Бургеры', icon: '🍔' },
      { name: 'Закуски', icon: '🍟' },
      { name: 'Десерты', icon: '🍦' },
      { name: 'Напитки', icon: '🥤' },
    ],
  },
  {
    id: 'restaurant',
    name: 'Ресторан',
    emoji: '🍽',
    description: 'Полное меню ресторана',
    categories: [
      { name: 'Закуски', icon: '🥗' },
      { name: 'Супы', icon: '🍲' },
      { name: 'Горячее', icon: '🍝' },
      { name: 'Десерты', icon: '🍰' },
      { name: 'Напитки', icon: '🍷' },
    ],
  },
  {
    id: 'cafe',
    name: 'Кафе',
    emoji: '🍰',
    description: 'Завтраки, обеды, десерты',
    categories: [
      { name: 'Завтраки', icon: '🍳' },
      { name: 'Обеды', icon: '🍲' },
      { name: 'Десерты', icon: '🍰' },
      { name: 'Напитки', icon: '☕' },
    ],
  },
  {
    id: 'other',
    name: 'Другое',
    emoji: '🍽',
    description: 'Создать без стартовых категорий',
    categories: [],
  },
]

export function getRestaurantType(id: string): RestaurantType | undefined {
  return RESTAURANT_TYPES.find((t) => t.id === id)
}