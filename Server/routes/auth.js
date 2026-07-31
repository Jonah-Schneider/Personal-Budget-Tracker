//Putting the required imports at the top
const pool = require('../config/db.js'); //Need to fix
const bcrypt = require('bcrypt');
const express = require('express');

//Creating router
const router = express.Router();

//Defining the Route 
router.post('/signup', async (req, res) => {
  // logic goes here
  const { email, password } = req.body;
  const saltRounds = 10;
  
  try{
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    'INSERT INTO users (password_hash, email) VALUES ($1, $2) RETURNING id, email',
    [hashedPassword, email]);
  
    res.status(201).json(result.rows[0]);
  }

  catch (error){
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }

}
);

//Needed so other files and classes can parse info from this router
module.exports = router;
