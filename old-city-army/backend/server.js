const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://old-city-army.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connesso con successo'))
  .catch(err => { console.error('❌ Errore MongoDB:', err.message); process.exit(1); });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/routes', require('./routes/percorsi'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/notifiche', require('./routes/notifiche'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Old City Army API attiva 🏍️' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server sulla porta ${PORT}`));
