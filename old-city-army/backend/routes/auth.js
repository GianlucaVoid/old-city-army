const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const Member   = require('../models/Member');
const { proteggi }       = require('../middleware/auth');
const { notificaAdmin }  = require('../utils/notifiche');

const generaToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/registra
router.post('/registra', async (req, res) => {
  try {
    const { nome, cognome, email, password, moto } = req.body;
    const esiste = await Member.findOne({ email });
    if (esiste) return res.status(400).json({ errore: 'Email già registrata.' });

    const membro = await Member.create({ nome, cognome, email, password, moto });
    const token  = generaToken(membro._id);

    // Notifica gli admin del nuovo membro
    await notificaAdmin({
      mittente:  membro._id,
      tipo:      'nuovo_membro',
      titolo:    '👤 Nuovo membro!',
      messaggio: `${nome} ${cognome} si è appena iscritto alla fratellanza.`,
      link:      '/admin',
    });

    res.status(201).json({
      token,
      membro: { id: membro._id, nome, cognome, email, ruolo: membro.ruolo },
    });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

// POST /api/auth/accedi
router.post('/accedi', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ errore: 'Email e password obbligatori.' });

    const membro = await Member.findOne({ email }).select('+password');
    if (!membro || !(await membro.confrontaPassword(password, membro.password))) {
      return res.status(401).json({ errore: 'Credenziali non valide.' });
    }

    const token = generaToken(membro._id);
    res.json({
      token,
      membro: { id: membro._id, nome: membro.nome, cognome: membro.cognome, email, ruolo: membro.ruolo },
    });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

// GET /api/auth/me
router.get('/me', proteggi, async (req, res) => {
  res.json({ membro: req.user });
});

module.exports = router;
