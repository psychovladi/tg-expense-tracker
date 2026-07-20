import { useState, type FormEvent } from 'react';
import { CATEGORIES, DEFAULT_CATEGORY_ID } from '../data/categories';
import { hapticFeedback } from '@telegram-apps/sdk-react';

const todayISO = () => new Date().toISOString().slice(0, 10);

interface Props {
  onAdd: (input: { amount: number; categoryId: string; note: string; date: string }) => void;
}

export function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    onAdd({ amount: parsed, categoryId, note, date });

    try {
      if (hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.impactOccurred('light');
      }
    } catch {
      // haptics are best-effort only
    }

    setAmount('');
    setNote('');
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="expense-form__row">
        <input
          className="expense-form__amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <span className="expense-form__currency">₽</span>
      </div>

      <div className="expense-form__categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`category-chip${c.id === categoryId ? ' category-chip--active' : ''}`}
            style={c.id === categoryId ? { background: c.color } : undefined}
            onClick={() => setCategoryId(c.id)}
          >
            <span className="category-chip__emoji">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="expense-form__row expense-form__row--secondary">
        <input
          className="expense-form__note"
          type="text"
          placeholder="Заметка (необязательно)"
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          className="expense-form__date"
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button type="submit" className="expense-form__submit">
        Добавить
      </button>
    </form>
  );
}
