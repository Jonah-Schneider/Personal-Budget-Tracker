import React, { useState } from 'react';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

import { getTransactions } from '../api/transactions.js';
import { createTransaction } from '../api/transactions.js';
import { deleteTransaction } from '../api/transactions.js';
import { updateTransaction } from '../api/transactions.js';
import { getSummary } from '../api/transactions.js';

import SpendingChart from '../components/SpendingChart.jsx';



function Dashboard() {

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const [editAmount, setEditAmount] = useState('');
  const [editType, setEditType] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');

  const [transactions, setTransactions] = useState([]);
  
  const [editingId, setEditingId] = useState(null);

  const { token, logout} = useAuth();
  
  const navigate = useNavigate();
  
  const [error, setError] = useState('');

  const [summary, setSummary] = useState(null);

  async function fetchData() {
    const data = await getTransactions(token);
    setTransactions(data);
  }
  
  async function handleSubmit(event) {
    event.preventDefault();

    const transactionData = {
      amount,
      type,
      category,
      description,
      date
    };
    
    try {
    await createTransaction(transactionData, token);
    fetchData();
    fetchSummary();
    setError('');

    setAmount('');
    setType('');
    setCategory('');
    setDescription('');
    setDate('');
    } 
    
    catch (err) {
    setError('Failed to create transaction. Check your inputs.');
    }


  };


  async function handleDelete(id) {
    
    try {
    await deleteTransaction(id, token);
    fetchData();
    fetchSummary();
    setError('');
    } 

    catch (err) {
    setError('Failed to delete transaction.');
    }
    
  };

  async function handleUpdate(event) {
    
    event.preventDefault();

    const transactionData = {
    amount: editAmount,
    type: editType,
    category: editCategory,
    description: editDescription,
    date: editDate
    };

    try {
      await updateTransaction(editingId, transactionData, token)
      fetchData();
      fetchSummary();
      setEditingId(null);
      setError('');
      
    }
    catch (err) {
      setError('Failed to update transaction')
    }
  }

  async function startEditing (transaction) {
    setEditAmount(transaction.amount);
    setEditType(transaction.type);
    setEditCategory(transaction.category);
    setEditDescription(transaction.description);
    setEditDate(transaction.date.split('T')[0]);
    setEditingId(transaction.id)
  }


  async function fetchSummary () {
    try {const data = await getSummary(token);
      setSummary(data);
      setError('');
    }
    catch (err) {
      setError('Failed to get transactions');
    }
  }


  async function handleLogout () {
    logout();
    navigate('login');
  }


  useEffect(() => {
  fetchData();
  fetchSummary();
  }, []);


  
  return (
    <div className= "min-h-screen bg-gray-50 p-8">

      <div className= "max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {error && <p>{error}</p>}
      
      <div>
      <button className="mx-auto max-w-6x1 px-4 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
       type="button" onClick={() => handleLogout()} >
      Logout
      </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
      <SpendingChart summary={summary} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-wrap gap-3 items-end">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select className="border border-gray-300 rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select type</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>


      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition">Add Transaction</button>
    </form>

    

   

      {transactions.map((transaction) => (
  <div key={transaction.id}>
    {editingId === transaction.id ? (
       <form onSubmit={handleUpdate} className="bg-blue-50 border border-blue-200 rounded-lg shadow p-4 mb-3 flex flex-wrap gap-3 items-end">
      <input
        type="number"
        placeholder="Amount"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
      <select className="border border-gray-300 rounded px-3 py-2" value={editType} onChange={(e) => setEditType(e.target.value)}>
        <option value="">Select type</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
      <input
        type="text"
        placeholder="Description"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
      <input
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />
      <button type="submit"  className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
      >Confirm Edit
      </button>
      <button type="button" onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-300 transition">
      Cancel
      </button>
    </form>
    ) : (
      <div className="flex gap-3">
        {transaction.category} - {transaction.amount}
       <button className="px-3 py-1 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition"
        onClick={() => handleDelete(transaction.id)}>
      Delete Transaction
      </button>
      <button className ="bg-gray-600 text-white font-medium px-3 py-1 rounded hover:bg-blue-700 transition"
      onClick={() => startEditing(transaction)}>
        Edit Transaction
      </button>
      </div>
    )}
  </div>
    ))}
  </div>

  </div>
  ); //end of Visual elements

  //end of function
}

export default Dashboard;

