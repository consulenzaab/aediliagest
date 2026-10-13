const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Errore di connessione al database:', err.stack);
    }
    console.log('Connessione al database PostgreSQL stabilita con successo!');
    release();
});

app.get('/api/cantieri', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cantieri ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore interno del server durante il recupero dei cantieri' });
    }
});

app.post('/api/cantieri', async (req, res) => {
    const { nome, cliente, indirizzo, stato } = req.body;
    try {
        const query = `
            INSERT INTO cantieri (nome, cliente, indirizzo, stato) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [nome, cliente, indirizzo, stato || 'In corso'];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la creazione del cantiere' });
    }
});

app.get('/api/risorse', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM risorse ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore interno del server durante il recupero delle risorse' });
    }
});

app.post('/api/risorse', async (req, res) => {
    const { nome, ruolo, costo_orario, ore_giornaliere } = req.body;
    try {
        const query = `
            INSERT INTO risorse (nome, ruolo, costo_orario, ore_giornaliere) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [nome, ruolo, costo_orario || 0.00, ore_giornaliere || 0.00];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante il salvataggio della risorsa' });
    }
});

app.listen(port, () => {
    console.log(`Server backend in ascolto sulla porta ${port}`);
});
