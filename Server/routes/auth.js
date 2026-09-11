//Putting the required imports at the top
const pool = require('../config/db.js'); //Need to fix
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

//Creating router
const router = express.Router();

//Defining the Route for sign up
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

//Creating the log-in features
router.post('/login', async (req, res) => {
const { email, password } = req.body;


try{
  const result = await pool.query(
  'SELECT * FROM users WHERE email = $1', 
  [email]);

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Wrong Email or Password' })
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Wrong Email or Password' })
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.status(200).json({token});

  }

  catch (error){
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
);



//Needed so other files and classes can parse info from this router
module.exports = router;
