const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotta di test per verificare che l'API sia attiva
app.get('/', (req, res) => {
  res.send('API AediliaGest attive e funzionanti!');
});

// API per ottenere la lista dei cantieri
app.get('/api/cantieri', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cantieri ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("ERRORE DATABASE COMPLETO (/api/cantieri):", err);
    res.status(500).json({ error: err.message });
  }
});

// API per inserire un nuovo cantiere
app.post('/api/cantieri', async (req, res) => {
  const { codice_cantiere, nome, indirizzo, budget_stimato } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO cantieri (codice_cantiere, nome, indirizzo, budget_stimato) VALUES ($1, $2, $3, $4) RETURNING *',
      [codice_cantiere, nome, indirizzo, budget_stimato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ERRORE DATABASE COMPLETO (POST /api/cantieri):", err);
    res.status(500).json({ error: err.message });
  }
});

// API per le Risorse Umane (con costi orari e giornalieri)
app.get('/api/risorse', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM risorse ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("ERRORE DATABASE COMPLETO (/api/risorse):", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4 
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
