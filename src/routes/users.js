const express = require('express');
const router = express.Router();
const { query } = require('../db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT id, name, email, phone FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT id, name, email, phone FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await query(
            'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
            [name, email, phone || null, hashedPassword]
        );

        const newUser = result.rows[0];
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(409).send('A user with that email already exists');
        }

        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    try {
        let query;
        let params;

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            query = `
                UPDATE users 
                SET name = $1, email = $2, phone = $3, password = $4 
                WHERE id = $5 
                RETURNING id, name, email, phone
            `;
            params = [name, email, phone || null, hashedPassword, id];
        } else {
            query = `
                UPDATE users 
                SET name = $1, email = $2, phone = $3 
                WHERE id = $4 
                RETURNING id, name, email, phone
            `;
            params = [name, email, phone || null, id];
        }

        const result = await query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(409).send('A user with that email already exists');
        }

        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
