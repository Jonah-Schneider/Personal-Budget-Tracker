import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getTransactions } from '../api/transactions.js';



function Dashboard() {

  const [transactions, setTransactions] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
  async function fetchData() {
    const data = await getTransactions(token);
    setTransactions(data);
  }
  fetchData();
  }, []);
  
  return (
    <div>
      <h1>Dashboard</h1>
      {transactions.map((transaction) => (
      <div key={transaction.id}>
        {transaction.category} - {transaction.amount}
      </div>
    ))}
    </div>
  );
}

export default Dashboard;

