const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM cantieri ORDER BY id DESC');
            return res.status(200).json(result.rows);
        } catch (err) {
            console.error("Errore DB cantieri:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    if (req.method === 'POST') {
        const { codice_cantiere, nome, indirizzo, budget_stimato } = req.body;
        try {
            const query = `
                INSERT INTO cantieri (codice_cantiere, nome, indirizzo, budget_stimato, stato) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [codice_cantiere, nome, indirizzo, budget_stimato || 0, 'In corso'];
            const result = await pool.query(query, values);
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error("Errore salvataggio cantiere:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Metodo non consentito' });
};
