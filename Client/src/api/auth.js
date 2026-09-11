import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function signup(email, password) {
  const response = await axios.post(`${API_URL}/api/auth/signup`, {
    email,
    password
  });
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/api/auth/login`, {email, password});
  return response.data;
}