const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/api/users', async (req, res) => {
    try {
        const result = await query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/users', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    try {
        const result = await query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
        const newUser = result.rows[0];

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
