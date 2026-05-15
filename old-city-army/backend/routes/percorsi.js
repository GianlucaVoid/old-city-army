// routes/percorsi.js
const express = require('express');
const router = express.Router();
const Percorso = require('../models/Percorso');
const { proteggi, soloAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const percorsi = await Percorso.find({ isPublished: true })
      .populate('autore', 'nome cognome')
      .sort({ createdAt: -1 });
    res.json(percorsi);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.post('/', proteggi, async (req, res) => {
  try {
    const p = await Percorso.create({ ...req.body, autore: req.user._id });
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

router.put('/:id', proteggi, async (req, res) => {
  try {
    const p = await Percorso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

router.delete('/:id', proteggi, soloAdmin, async (req, res) => {
  try {
    await Percorso.findByIdAndDelete(req.params.id);
    res.json({ messaggio: 'Percorso eliminato.' });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

module.exports = router;
