import { useCallback, useEffect, useState } from 'react';
import type { Expense } from '../types';
import { loadAllExpenses, persistExpenses } from '../telegram/storage';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadAllExpenses().then((loaded) => {
      if (!cancelled) {
        setExpenses(loaded.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const addExpense = useCallback((input: { amount: number; categoryId: string; note: string; date: string }) => {
    const expense: Expense = {
      id: makeId(),
      amount: input.amount,
      categoryId: input.categoryId,
      note: input.note.trim(),
      date: input.date,
      createdAt: Date.now(),
    };
    setExpenses((prev) => {
      const next = [expense, ...prev];
      void persistExpenses(next, [expense.date]);
      return next;
    });
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const target = prev.find((e) => e.id === id);
      const next = prev.filter((e) => e.id !== id);
      if (target) void persistExpenses(next, [target.date]);
      return next;
    });
  }, []);

  return { expenses, loading, addExpense, removeExpense };
}
