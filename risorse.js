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
            const result = await pool.query('SELECT * FROM risorse ORDER BY id DESC');
            return res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            return res.status(200).json([]); // Fallback array vuoto se la tabella non ha dati o fallisce
        }
    }

    if (req.method === 'POST') {
        const { nome, ruolo, costo_orario, ore_giornaliere } = req.body;
        try {
            const query = `
                INSERT INTO risorse (nome, ruolo, costo_orario, ore_giornaliere) 
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const values = [nome, ruolo, costo_orario || 0.00, ore_giornaliere || 0.00];
            const result = await pool.query(query, values);
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore durante il salvataggio della risorsa' });
        }
    }

    return res.status(405).json({ error: 'Metodo non consentito' });
}
