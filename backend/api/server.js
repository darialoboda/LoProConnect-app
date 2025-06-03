const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('../routes/userRoutes');
const courseRoutes = require('../routes/courseRoutes');
const testRoutes = require('../routes/testRoutes');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Обслуговування статичних файлів
app.use('/public', express.static('/tmp'));

// API статус
app.get('/', (req, res) => { res.json('API start!'); });

// Реєструємо маршрути
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/tests', testRoutes);

// Vercel API handler
module.exports = app;
