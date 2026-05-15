const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const proteggi = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ errore: 'Non sei autenticato. Accedi per continuare.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const membro = await Member.findById(decoded.id);

    if (!membro) {
      return res.status(401).json({ errore: 'Il membro non esiste più.' });
    }

    req.user = membro;
    next();
  } catch (err) {
    return res.status(401).json({ errore: 'Token non valido o scaduto.' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.user.ruolo !== 'admin' && req.user.ruolo !== 'presidente') {
    return res.status(403).json({ errore: 'Accesso riservato agli amministratori.' });
  }
  next();
};

module.exports = { proteggi, soloAdmin };
