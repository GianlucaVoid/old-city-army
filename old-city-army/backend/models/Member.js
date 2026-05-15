const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true,
  },
  cognome: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email è obbligatoria"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email non valida'],
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: [6, 'La password deve avere almeno 6 caratteri'],
    select: false,
  },
  moto: {
    type: String,
    trim: true,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  ruolo: {
    type: String,
    enum: ['membro', 'veterano', 'presidente', 'admin'],
    default: 'membro',
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio non può superare i 500 caratteri'],
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dataIscrizione: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password prima del salvataggio
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Metodo per confrontare le password
memberSchema.methods.confrontaPassword = async function (passwordInserita, passwordHashata) {
  return await bcrypt.compare(passwordInserita, passwordHashata);
};

module.exports = mongoose.model('Member', memberSchema);
