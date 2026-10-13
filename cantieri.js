const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    // Configurazione CORS universale
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM cantieri ORDER BY id DESC');
            return res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore durante il recupero dei cantieri' });
        }
    }

    if (req.method === 'POST') {
        const { nome, cliente, indirizzo, stato } = req.body;
        try {
            const query = `
                INSERT INTO cantieri (nome, cliente, indirizzo, stato) 
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const values = [nome, cliente, indirizzo, stato || 'In corso'];
            const result = await pool.query(query, values);
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore durante la creazione del cantiere' });
        }
    }

    return res.status(405).json({ error: 'Metodo non consentito' });
}
