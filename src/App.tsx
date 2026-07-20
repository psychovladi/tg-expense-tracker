import { lazy, Suspense, useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SummaryBar } from './components/SummaryBar';
import './App.css';

// recharts is sizeable — load it only when the stats tab is actually opened.
const CategoryChart = lazy(() =>
  import('./components/CategoryChart').then((m) => ({ default: m.CategoryChart })),
);

type Tab = 'expenses' | 'stats';

export default function App() {
  const { expenses, loading, addExpense, removeExpense } = useExpenses();
  const [tab, setTab] = useState<Tab>('expenses');

  return (
    <div className="app">
      <header className="app__header">
        <h1>Мои расходы</h1>
      </header>

      <SummaryBar expenses={expenses} />

      <nav className="tabs">
        <button
          className={`tabs__btn${tab === 'expenses' ? ' tabs__btn--active' : ''}`}
          onClick={() => setTab('expenses')}
        >
          Расходы
        </button>
        <button
          className={`tabs__btn${tab === 'stats' ? ' tabs__btn--active' : ''}`}
          onClick={() => setTab('stats')}
        >
          Статистика
        </button>
      </nav>

      <main className="app__main">
        {loading ? (
          <p className="empty-state">Загрузка…</p>
        ) : tab === 'expenses' ? (
          <>
            <ExpenseForm onAdd={addExpense} />
            <ExpenseList expenses={expenses} onRemove={removeExpense} />
          </>
        ) : (
          <Suspense fallback={<p className="empty-state">Загрузка…</p>}>
            <CategoryChart expenses={expenses} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
