const express      = require('express');
const router       = express.Router();
const Notification = require('../models/Notification');
const { proteggi } = require('../middleware/auth');

// GET /api/notifiche — tutte le notifiche dell'utente loggato
router.get('/', proteggi, async (req, res) => {
  try {
    const notifiche = await Notification.find({ destinatario: req.user._id })
      .populate('mittente', 'nome cognome avatar')
      .sort({ createdAt: -1 })
      .limit(50);  // ultime 50

    const nonLette = await Notification.countDocuments({
      destinatario: req.user._id,
      letta: false,
    });

    res.json({ notifiche, nonLette });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// PATCH /api/notifiche/:id/leggi — segna una come letta
router.patch('/:id/leggi', proteggi, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, destinatario: req.user._id },
      { letta: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// PATCH /api/notifiche/leggi-tutte — segna tutte come lette
router.patch('/leggi-tutte', proteggi, async (req, res) => {
  try {
    await Notification.updateMany(
      { destinatario: req.user._id, letta: false },
      { letta: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// DELETE /api/notifiche/:id — elimina una notifica
router.delete('/:id', proteggi, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      destinatario: req.user._id,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// DELETE /api/notifiche — elimina tutte
router.delete('/', proteggi, async (req, res) => {
  try {
    await Notification.deleteMany({ destinatario: req.user._id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

module.exports = router;
