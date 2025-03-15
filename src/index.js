const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const { router: authRoutes } = require('./routes/auth');
const { initDB } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true
}));
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

const startServer = async () => {
    try {
        await initDB();

        app.listen(port, '0.0.0.0', () => {
            console.log(`Backend server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
