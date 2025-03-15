const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDB = async (retries = 5, delay = 3000) => {
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            try {
                console.log('Database connected successfully');

                await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            password VARCHAR(255) NOT NULL
          );
        `);
                console.log('Users table initialized');
                return;
            } finally {
                client.release();
            }
        } catch (err) {
            console.log(`Database connection attempt ${i + 1}/${retries} failed:`, err.message);
            lastError = err;
            await sleep(delay);
        }
    }

    console.error('Database connection failed after multiple attempts:', lastError);
    throw lastError;
};

const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
    initDB,
    pool
};
