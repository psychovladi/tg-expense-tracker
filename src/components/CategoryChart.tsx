import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Expense } from '../types';
import { CATEGORIES, CURRENCY } from '../data/categories';

interface Props {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: Props) {
  const monthPrefix = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthPrefix));

  const data = CATEGORIES.map((c) => ({
    name: c.label,
    emoji: c.emoji,
    color: c.color,
    value: monthExpenses.filter((e) => e.categoryId === c.id).reduce((s, e) => s + e.amount, 0),
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="empty-state">Добавьте расходы, чтобы увидеть статистику за месяц.</p>;
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="category-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${Number(value).toLocaleString('ru-RU')} ${CURRENCY}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="category-chart__legend">
        {data
          .sort((a, b) => b.value - a.value)
          .map((d) => (
            <li key={d.name} className="category-chart__legend-item">
              <span className="category-chart__legend-dot" style={{ background: d.color }} />
              <span className="category-chart__legend-name">
                {d.emoji} {d.name}
              </span>
              <span className="category-chart__legend-value">
                {d.value.toLocaleString('ru-RU')} {CURRENCY}
              </span>
              <span className="category-chart__legend-pct">{Math.round((d.value / total) * 100)}%</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
