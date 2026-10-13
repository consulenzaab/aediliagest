const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
// Forza l'uso di IPv4 per evitare l'errore ENETUNREACH su Render
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS per permettere le richieste dal frontend su Vercel
app.use(cors({
    origin: '*', // Puoi anche metterlo aperto a tutto per testare o limitarlo al tuo dominio Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configurazione della connessione al database PostgreSQL (Supabase Connection Pooler)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessario per le connessioni sicure a Supabase da Render
    }
});

// Test della connessione al database all'avvio
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Errore di connessione al database:', err.stack);
    }
    console.log('Connessione al database PostgreSQL stabilita con successo!');
    release();
});

// ==================== ROTTE CANTIERI ====================

// GET: Ottieni tutti i cantieri
app.get('/api/cantieri', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cantieri ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500.0).json({ error: 'Errore interno del server durante il recupero dei cantieri' });
    }
});

// POST: Aggiungi un nuovo cantiere
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


// ==================== ROTTE RISORSE ====================

// GET: Ottieni tutte le risorse
app.get('/api/risorse', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM risorse ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore interno del server durante il recupero delle risorse' });
    }
});

// POST: Aggiungi una nuova risorsa
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
// Avvio del server
app.listen(port, () => {
    console.log(`Server backend in ascolto sulla porta ${port}`);
});
"Aggiunto fix IPv4"
