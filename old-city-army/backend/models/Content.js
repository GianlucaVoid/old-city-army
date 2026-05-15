const mongoose = require('mongoose');

// ─── Blog Post ────────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  titolo:      { type: String, required: true, trim: true },
  contenuto:   { type: String, required: true },
  estratto:    { type: String, maxlength: 300 },
  immagine:    { type: String, default: '' },
  tags:        [{ type: String }],
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  visite:      { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Gallery Item ─────────────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  url:         { type: String, required: true },
  thumbnail:   { type: String, default: '' },
  titolo:      { type: String, default: '' },
  descrizione: { type: String, default: '' },
  categoria: {
    type: String,
    enum: ['moto', 'raduno', 'percorso', 'misc'],
    default: 'misc',
  },
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogSchema);
const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

module.exports = { BlogPost, GalleryItem };
