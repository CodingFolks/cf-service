const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'yourusername',
    host: 'postgres',
    database: process.env.DB_NAME || 'yourdatabase',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
});

async function updateSchema() {
    try {
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL, 
      ADD COLUMN phone VARCHAR(20), 
      ADD COLUMN password VARCHAR(255) NOT NULL
    `);
        console.log('Schema updated successfully');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await pool.end();
    }
}

updateSchema();
