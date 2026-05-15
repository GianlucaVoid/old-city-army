const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // chi riceve la notifica
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    // chi ha scatenato la notifica (es. admin che crea un raduno)
    mittente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        default: null,
    },
    tipo: {
        type: String,
        enum: [
            'nuovo_raduno',       // admin crea un raduno
            'raduno_aggiornato',  // admin modifica un raduno
            'nuovo_post',         // admin pubblica articolo blog
            'like_foto',          // qualcuno mette like alla tua foto
            'nuovo_membro',       // nuovo membro si unisce (solo admin)
            'sistema',            // messaggio di sistema generico
        ],
        required: true,
    },
    titolo: { type: String, required: true },
    messaggio: { type: String, required: true },
    link: { type: String, default: '' },   // es. "/raduni/123"
    letta: { type: Boolean, default: false },
}, {
    timestamps: true,
});

// Index per query veloci per destinatario
notificationSchema.index({ destinatario: 1, letta: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
