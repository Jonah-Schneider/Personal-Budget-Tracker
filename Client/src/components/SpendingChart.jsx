import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6699'];

function SpendingChart({ summary }) {
  if (!summary) {
    return <p>Loading chart...</p>;
  }

  const chartData = summary.byCategory.map((item) => ({
    category: item.category,
    total: Number(item.total)
  }));

  return (
    <div>
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="total"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>

    <div>
    <p>Total Income: ${Number(summary.totalIncome).toFixed(2)}</p>
    <p>Total Expenses: ${Number(summary.totalExpenses).toFixed(2)}</p>
    <p>Net: ${(Number(summary.totalIncome) - Number(summary.totalExpenses)).toFixed(2)}</p>
    </div>
    
    </div>
  );
}

export default SpendingChart;