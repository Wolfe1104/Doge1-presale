const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
coonst app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'https://dojiwan.com' }));
app.use(express.json());

// PostgreSQL connection (we'll configure this later)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});


app.post('/users', async (req, res) => {
  const { username, email, phone, address, password, doji } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, phone, address, password, doji) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, email, phone, address, password, doji]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user');
  }
});


// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
       res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
