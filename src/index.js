const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const { router: authRoutes } = require('./routes/auth');
const { initDB } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://168.119.254.41:9000',
    credentials: true
}));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
    try {
        await initDB();

        app.listen(port, '0.0.0.0', () => {
            console.log(`Backend server is running on http://0.0.0.0:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully!!');
    process.exit(0);
});

startServer();
