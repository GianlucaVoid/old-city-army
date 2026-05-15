const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: [true, 'Il titolo è obbligatorio'],
    trim: true,
  },
  descrizione: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: [true, 'La data è obbligatoria'],
  },
  luogo: {
    type: String,
    required: [true, 'Il luogo è obbligatorio'],
  },
  immagine: {
    type: String,
    default: '',
  },
  partecipanti: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  maxPartecipanti: {
    type: Number,
    default: 0, // 0 = illimitati
  },
  tipo: {
    type: String,
    enum: ['raduno', 'gita', 'evento_speciale'],
    default: 'raduno',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  creatore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
