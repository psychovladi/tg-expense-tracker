import type { Expense } from '../types';
import { getCategory } from '../data/categories';

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
  if (expenses.length === 0) {
    return <p className="empty-state">Пока нет расходов — добавьте первый выше.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((e) => {
        const category = getCategory(e.categoryId);
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
            <span className="expense-list__amount">{formatAmount(e.amount)} ₽</span>
            <button
              type="button"
              className="expense-list__remove"
              aria-label="Удалить"
              onClick={() => onRemove(e.id)}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
