import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth.js';


function Signup() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password);
      navigate('/login');
    } catch (err) {
      setError('Incorrect email or password format');
    }


  }
  
  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Signup;