const app = require('./server');
const mongoose = require('mongoose');

// Підключення до MongoDB
mongoose.connect('path/to/db')
    .then(() => console.log('✅ Успішне підключення до MongoDB'))
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err));

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
