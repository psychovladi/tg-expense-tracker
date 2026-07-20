export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  note: string;
  /** ISO date string (yyyy-mm-dd) */
  date: string;
  createdAt: number;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}
