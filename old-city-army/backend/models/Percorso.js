const mongoose = require('mongoose');

const percorsoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del percorso è obbligatorio'],
    trim: true,
  },
  descrizione: {
    type: String,
    required: true,
  },
  distanzaKm: {
    type: Number,
    required: true,
  },
  difficolta: {
    type: String,
    enum: ['facile', 'medio', 'difficile', 'esperto'],
    default: 'medio',
  },
  partenza: { type: String, required: true },
  arrivo:   { type: String, required: true },
  tappe: [{
    nome:        { type: String },
    descrizione: { type: String },
    coordinate:  { lat: Number, lng: Number },
  }],
  immagini: [{ type: String }],
  gpxFile:  { type: String, default: '' },
  durata:   { type: String, default: '' }, // es. "3 ore"
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  isPublished: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Percorso', percorsoSchema);
