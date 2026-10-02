# Personal Budget Tracker

A full-stack web app for tracking income and expenses, with secure authentication and a live spending breakdown chart.

**[Live Demo →](https://personal-budget-tracker-jonah.vercel.app/)**

![Dashboard screenshot]
<img width="1392" height="881" alt="image" src="https://github.com/user-attachments/assets/3bb1ae84-dcad-4986-a477-2574d6b7b614" />

## Features

- **User authentication** — signup and login with hashed passwords (bcrypt) and JWT-based sessions
- **Transaction management** — create, edit, and delete income/expense entries
- **Category filtering** — view transactions filtered by category
- **Spending breakdown chart** — interactive pie chart (Recharts) showing expenses by category
- **Income/expense summary** — totals and net balance at a glance
- **Protected routes** — the dashboard is only accessible when logged in
- **Per-user data isolation** — every transaction query is scoped to the logged-in user, verified with cross-account security testing

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Recharts, Axios
**Backend:** Node.js, Express, JWT, bcrypt
**Database:** PostgreSQL (hosted on Neon)
**Deployment:** Vercel (frontend), Render (backend)

## Running It Locally

### Prerequisites
- Node.js (v20+ recommended)
- A PostgreSQL database (e.g., a free [Neon](https://neon.tech) instance)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Jonah-Schneider/Personal-Budget-Tracker.git
   cd Personal-Budget-Tracker
   ```

2. **Backend setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in `server/` with:
   ```
   PORT=5000
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secret_key
   ```
   Run the table-creation SQL (see `/schema.sql` if included, or recreate the `users` and `transactions` tables as described below) against your database, then start the server:
   ```bash
   npm run dev
   ```

3. **Frontend setup** (in a separate terminal):
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in `client/` with:
   ```
   VITE_API_URL=http://localhost:5000
   ```
   Then run:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173` in your browser.

### Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Overview

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Create a new account | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| GET | `/api/transactions` | Get all transactions for the logged-in user (supports `?category=` filtering) | Yes |
| POST | `/api/transactions` | Create a transaction | Yes |
| PUT | `/api/transactions/:id` | Update a transaction (owner-only) | Yes |
| DELETE | `/api/transactions/:id` | Delete a transaction (owner-only) | Yes |
| GET | `/api/transactions/summary` | Get income/expense totals and category breakdown | Yes |

## What I'd Improve With More Time

- A trend chart showing income/spending over time (currently the chart only shows a category breakdown of expenses)
- Server-side input validation (e.g., minimum password length, more robust field checks)
- Rate limiting on the login route to prevent brute-force attempts
- Automated tests (unit tests for the API routes, integration tests for the auth flow)
- Recurring transactions and monthly budget limits

## What I Learned Building This

This was another great experience in full-stack development, covering the entire path from database design to a deployed, publicly usable app:
- Designing a relational schema and writing parameterized SQL queries to prevent injection
- Implementing authentication with bcrypt password hashing and JWT-based sessions
- Building and testing authorization logic (confirming one user's token can't access another user's data)
- Managing state and data flow across a multi-page React app, including context for global auth state
- Debugging real deployment issues (CORS configuration, environment variables, missing production dependencies)
