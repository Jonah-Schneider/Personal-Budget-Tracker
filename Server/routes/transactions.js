const express = require('express');
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

const router = express.Router();




router.get('/summary', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const incomeResult = await pool.query(
      "SELECT SUM(amount) FROM transactions WHERE user_id = $1 AND type = 'income'",
      [userId]
    );

    const expenseResult = await pool.query(
      "SELECT SUM(amount) FROM transactions WHERE user_id = $1 AND type = 'expense'",
      [userId]
    );

    const categoryResult = await pool.query(
      "SELECT category, SUM(amount) AS total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY category",
      [userId]
    );

    res.status(200).json({
      totalIncome: incomeResult.rows[0].sum || 0,
      totalExpenses: expenseResult.rows[0].sum || 0,
      byCategory: categoryResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Web Server Error" });
  }
});


router.post('/', verifyToken, async (req, res) => {
  const { amount, type, category, description, date } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, amount, type, category, description, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Web Server Error"});
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;
  //Add option to sort by category
  const { category } = req.query;

  try {
    let result;
    if (category) {
        result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 AND category = $2',
      [userId, category]
    );
    }
    else {
    result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1',
      [userId]
    );}

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Web Server Error"});
  }
});

router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.userId;
    const transactionId = req.params.id;
    const { amount, type, category, description, date } = req.body;
   
    try {
    const result = await pool.query(
        'UPDATE transactions SET amount = $1, type = $2, category = $3, description = $4, date = $5 WHERE id = $6 AND user_id = $7 RETURNING *', [ amount, type, category, description, date, transactionId, userId]
    );
        if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid Data entry"});
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Web Server Error"});
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.userId;
  const transactionId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invalid Data Entry"});
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Web Server Error" });
  }
});



module.exports = router;