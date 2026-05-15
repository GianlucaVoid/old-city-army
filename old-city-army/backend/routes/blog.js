const express = require('express');
const router = express.Router();
const { BlogPost } = require('../models/Content');
const { proteggi, soloAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true })
      .populate('autore', 'nome cognome')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id, { $inc: { visite: 1 } }, { new: true }
    ).populate('autore', 'nome cognome');
    if (!post) return res.status(404).json({ errore: 'Post non trovato.' });
    res.json(post);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.post('/', proteggi, soloAdmin, async (req, res) => {
  try {
    const post = await BlogPost.create({ ...req.body, autore: req.user._id });
    res.status(201).json(post);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

router.put('/:id', proteggi, soloAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ errore: 'Post non trovato.' });
    res.json(post);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

router.delete('/:id', proteggi, soloAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ messaggio: 'Articolo eliminato.' });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

module.exports = router;
