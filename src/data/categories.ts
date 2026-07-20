import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Еда', emoji: '🍔', color: '#f59e0b' },
  { id: 'transport', label: 'Транспорт', emoji: '🚕', color: '#3b82f6' },
  { id: 'home', label: 'Дом', emoji: '🏠', color: '#10b981' },
  { id: 'health', label: 'Здоровье', emoji: '💊', color: '#ef4444' },
  { id: 'fun', label: 'Развлечения', emoji: '🎮', color: '#a855f7' },
  { id: 'shopping', label: 'Покупки', emoji: '🛍️', color: '#ec4899' },
  { id: 'subscriptions', label: 'Подписки', emoji: '🔁', color: '#06b6d4' },
  { id: 'other', label: 'Другое', emoji: '✨', color: '#6b7280' },
];

export const DEFAULT_CATEGORY_ID = CATEGORIES[0].id;

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
