const Notification = require('../models/Notification');
const Member = require('../models/Member');

/**
 * Crea una notifica per UN singolo utente
 */
const creaNotifica = async ({ destinatario, mittente, tipo, titolo, messaggio, link }) => {
    try {
        await Notification.create({ destinatario, mittente, tipo, titolo, messaggio, link });
    } catch (err) {
        console.error('Errore creazione notifica:', err.message);
    }
};

/**
 * Crea la stessa notifica per TUTTI i membri attivi
 * (es. nuovo raduno → avvisa tutti)
 * Esclude il mittente stesso
 */
const notificaTutti = async ({ mittente, tipo, titolo, messaggio, link }) => {
    try {
        const membri = await Member.find({ isActive: true, _id: { $ne: mittente } }).select('_id');
        const docs = membri.map(m => ({
            destinatario: m._id,
            mittente,
            tipo,
            titolo,
            messaggio,
            link,
            letta: false,
        }));
        if (docs.length > 0) {
            await Notification.insertMany(docs);
        }
        console.log(`📣 Notifica "${titolo}" inviata a ${docs.length} membri`);
    } catch (err) {
        console.error('Errore notifica massa:', err.message);
    }
};

/**
 * Notifica solo gli admin/presidenti
 * (es. nuovo membro si registra)
 */
const notificaAdmin = async ({ mittente, tipo, titolo, messaggio, link }) => {
    try {
        const admins = await Member.find({
            ruolo: { $in: ['admin', 'presidente'] },
            _id: { $ne: mittente },
        }).select('_id');

        const docs = admins.map(a => ({
            destinatario: a._id,
            mittente,
            tipo,
            titolo,
            messaggio,
            link,
            letta: false,
        }));
        if (docs.length > 0) await Notification.insertMany(docs);
    } catch (err) {
        console.error('Errore notifica admin:', err.message);
    }
};

module.exports = { creaNotifica, notificaTutti, notificaAdmin };
