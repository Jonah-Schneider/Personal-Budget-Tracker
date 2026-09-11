import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function getTransactions(token) {
  const response = await axios.get(`${API_URL}/api/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export async function createTransaction(transactionData, token) {
  const response = await axios.post(
    `${API_URL}/api/transactions`,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}

export async function updateTransaction(id, transactionData, token) {
  const response = await axios.put(
    //Need the id to know what transaction to update
    `${API_URL}/api/transactions/${id}`,
    transactionData,
    {

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}

export async function deleteTransaction( id, token) {
  const response = await axios.delete(
    `${API_URL}/api/transactions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}

export async function getSummary(token) {
  const response = await axios.get(
    `${API_URL}/api/transactions/summary`,
  
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}