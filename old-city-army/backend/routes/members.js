// routes/members.js
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { proteggi, soloAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ isActive: true }).select('-__v').sort({ dataIscrizione: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ errore: err.message }); }
});

router.put('/me', proteggi, async (req, res) => {
  try {
    const { nome, cognome, moto, bio, avatar } = req.body;
    const membro = await Member.findByIdAndUpdate(
      req.user._id,
      { nome, cognome, moto, bio, avatar },
      { new: true, runValidators: true }
    );
    res.json(membro);
  } catch (err) { res.status(400).json({ errore: err.message }); }
});

module.exports = router;
