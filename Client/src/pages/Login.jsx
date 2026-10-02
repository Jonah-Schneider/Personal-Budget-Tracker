import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { token } = await login(email, password);
      saveToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Incorrect email or password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>
      <Link to="/signup" className="block mb-4 text-blue-600 hover:underline">
        Don't have an account? Sign up
      </Link>
      <form onSubmit={handleSubmit}>
        <label className= "block mb-4">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </label>

        <label className= "block mb-4">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      </div>
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
}

export default Login;