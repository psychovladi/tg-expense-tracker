import { useState } from 'react';
import type { Expense } from '../types';
import { getCategory, CURRENCY } from '../data/categories';

interface Props {
  expenses: Expense[];
  onRemove: (id: string) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const formatAmount = (n: number) =>
  n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function ExpenseList({ expenses, onRemove }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return <p className="empty-state">Пока нет расходов — добавьте первый выше.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((e) => {
        const category = getCategory(e.categoryId);
        const confirming = confirmId === e.id;

        if (confirming) {
          return (
            <li key={e.id} className="expense-list__item expense-list__item--confirm">
              <span className="expense-list__confirm-text">
                Удалить «{category.label}, {formatAmount(e.amount)} {CURRENCY}»?
              </span>
              <span className="expense-list__confirm-actions">
                <button
                  type="button"
                  className="expense-list__confirm-btn expense-list__confirm-btn--cancel"
                  onClick={() => setConfirmId(null)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="expense-list__confirm-btn expense-list__confirm-btn--delete"
                  onClick={() => onRemove(e.id)}
                >
                  Удалить
                </button>
              </span>
            </li>
          );
        }

        return (
          <li key={e.id} className="expense-list__item">
            <span className="expense-list__icon" style={{ background: category.color }}>
              {category.emoji}
            </span>
            <span className="expense-list__info">
              <span className="expense-list__title">{category.label}</span>
              {e.note && <span className="expense-list__note">{e.note}</span>}
            </span>
            <span className="expense-list__date">{formatDate(e.date)}</span>
            <span className="expense-list__amount">{formatAmount(e.amount)} {CURRENCY}</span>
            <button
              type="button"
              className="expense-list__remove"
              aria-label="Удалить"
              onClick={() => setConfirmId(e.id)}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
