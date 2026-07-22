import type { Expense } from '../types';
import { CURRENCY } from '../data/categories';

interface Props {
  expenses: Expense[];
}

const currentMonthPrefix = () => new Date().toISOString().slice(0, 7);

export function SummaryBar({ expenses }: Props) {
  const monthPrefix = currentMonthPrefix();
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(monthPrefix))
    .reduce((sum, e) => sum + e.amount, 0);

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayTotal = expenses
    .filter((e) => e.date === todayISO)
    .reduce((sum, e) => sum + e.amount, 0);

  const fmt = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

  return (
    <div className="summary-bar">
      <div className="summary-bar__item">
        <span className="summary-bar__label">Сегодня</span>
        <span className="summary-bar__value">{fmt(todayTotal)} {CURRENCY}</span>
      </div>
      <div className="summary-bar__item">
        <span className="summary-bar__label">За месяц</span>
        <span className="summary-bar__value summary-bar__value--main">{fmt(monthTotal)} {CURRENCY}</span>
      </div>
    </div>
  );
}
