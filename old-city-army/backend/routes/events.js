const express  = require('express');
const router   = express.Router();
const Event    = require('../models/Event');
const { proteggi, soloAdmin }         = require('../middleware/auth');
const { notificaTutti, creaNotifica } = require('../utils/notifiche');
const Notification = require('../models/Notification');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .populate('creatore', 'nome cognome')
      .populate('partecipanti', 'nome cognome')
      .sort({ data: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creatore', 'nome cognome')
      .populate('partecipanti', 'nome cognome moto');
    if (!event) return res.status(404).json({ errore: 'Evento non trovato.' });
    res.json(event);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

// Crea raduno → notifica tutti
router.post('/', proteggi, soloAdmin, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, creatore: req.user._id });
    await notificaTutti({
      mittente:  req.user._id,
      tipo:      'nuovo_raduno',
      titolo:    '🏍️ Nuovo Raduno!',
      messaggio: `"${event.titolo}" — ${new Date(event.data).toLocaleDateString('it-IT')} a ${event.luogo}`,
      link:      '/raduni',
    });
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

// Modifica raduno → notifica partecipanti
router.put('/:id', proteggi, soloAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('partecipanti', '_id');
    if (event.partecipanti?.length > 0) {
      const docs = event.partecipanti
        .filter(p => p._id.toString() !== req.user._id.toString())
        .map(p => ({
          destinatario: p._id,
          mittente:     req.user._id,
          tipo:         'raduno_aggiornato',
          titolo:       '📝 Raduno aggiornato',
          messaggio:    `"${event.titolo}" ha ricevuto modifiche. Controlla i dettagli.`,
          link:         '/raduni',
          letta:        false,
        }));
      if (docs.length > 0) await Notification.insertMany(docs);
    }
    res.json(event);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

router.delete('/:id', proteggi, soloAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ messaggio: 'Evento eliminato.' });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.post('/:id/partecipa', proteggi, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ errore: 'Evento non trovato.' });
    const giaIscritto = event.partecipanti.includes(req.user._id);
    if (giaIscritto) { event.partecipanti.pull(req.user._id); }
    else             { event.partecipanti.push(req.user._id); }
    await event.save();
    res.json({ partecipanti: event.partecipanti.length, iscritto: !giaIscritto });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

module.exports = router;
