const express = require('express');
const router  = express.Router();
const { GalleryItem } = require('../models/Content');
const { proteggi }    = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/upload');

// GET — lista foto (invariato)
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria } : {};
    const items  = await GalleryItem.find(filtro)
      .populate('autore', 'nome cognome')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

// POST — carica foto con file reale
// "upload.single('foto')" significa: aspettati UN file nel campo chiamato "foto"
router.post('/', proteggi, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errore: 'Nessun file caricato.' });
    }

    const item = await GalleryItem.create({
      url:         req.file.path,        // URL Cloudinary
      thumbnail:   req.file.path,
      titolo:      req.body.titolo      || '',
      descrizione: req.body.descrizione || '',
      categoria:   req.body.categoria   || 'misc',
      autore:      req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

// DELETE — elimina foto anche da Cloudinary
router.delete('/:id', proteggi, async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ errore: 'Foto non trovata.' });

    if (item.autore.toString() !== req.user._id.toString()) {
      return res.status(403).json({ errore: 'Non autorizzato.' });
    }

    // Elimina da Cloudinary (estrai public_id dall'URL)
    const publicId = item.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`oldcityarmy/${publicId}`);

    await item.deleteOne();
    res.json({ messaggio: 'Foto eliminata.' });
  } catch (err) {
    res.status(500).json({ errore: err.message });
  }
});

// POST like (invariato)
router.post('/:id/like', proteggi, async (req, res) => {
  try {
    const item      = await GalleryItem.findById(req.params.id);
    const haPiaciuto = item.likes.includes(req.user._id);
    if (haPiaciuto) { item.likes.pull(req.user._id); }
    else            { item.likes.push(req.user._id); }
    await item.save();
    res.json({ likes: item.likes.length, liked: !haPiaciuto });
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

module.exports = router;