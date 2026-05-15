import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifiche } from '../context/NotificheContext';
import './NotificationBell.css';

// Icona colore in base al tipo
const tipoConfig = {
  nuovo_raduno:      { emoji: '🏍️', colore: '#e8441a' },
  raduno_aggiornato: { emoji: '📝', colore: '#f59e0b' },
  nuovo_post:        { emoji: '📰', colore: '#3b82f6' },
  like_foto:         { emoji: '❤️', colore: '#ec4899' },
  nuovo_membro:      { emoji: '👤', colore: '#22c55e' },
  sistema:           { emoji: '🔔', colore: '#a855f7' },
};

const tempoFa = (data) => {
  const diff = Date.now() - new Date(data).getTime();
  const min  = Math.floor(diff / 60000);
  const ore  = Math.floor(min / 60);
  const gg   = Math.floor(ore / 24);
  if (min < 1)   return 'adesso';
  if (min < 60)  return `${min}m fa`;
  if (ore < 24)  return `${ore}h fa`;
  if (gg < 7)    return `${gg}g fa`;
  return new Date(data).toLocaleDateString('it-IT');
};

const NotificationBell = () => {
  const { notifiche, nonLette, segnaLetta, segnaLetteTutte, eliminaNotifica } = useNotifiche();
  const [aperto, setAperto] = useState(false);
  const navigate  = useNavigate();
  const ref       = useRef();

  // Chiudi il dropdown cliccando fuori
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setAperto(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (notifica) => {
    if (!notifica.letta) segnaLetta(notifica._id);
    if (notifica.link)   navigate(notifica.link);
    setAperto(false);
  };

  return (
    <div className="bell-wrap" ref={ref}>
      {/* ── Campanella ── */}
      <button
        className={`bell-btn ${aperto ? 'bell-btn--open' : ''}`}
        onClick={() => setAperto(o => !o)}
        aria-label="Notifiche"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {nonLette > 0 && (
          <span className="bell-badge">{nonLette > 9 ? '9+' : nonLette}</span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {aperto && (
        <div className="bell-dropdown">
          {/* Header */}
          <div className="bell-dropdown__header">
            <span className="bell-dropdown__title">
              Notifiche {nonLette > 0 && <span className="bell-dropdown__count">{nonLette}</span>}
            </span>
            {nonLette > 0 && (
              <button className="bell-dropdown__leggi-tutte" onClick={segnaLetteTutte}>
                Segna tutte lette
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="bell-dropdown__list">
            {notifiche.length === 0 ? (
              <div className="bell-dropdown__empty">
                <span>🔔</span>
                <p>Nessuna notifica</p>
              </div>
            ) : (
              notifiche.slice(0, 8).map(n => {
                const cfg = tipoConfig[n.tipo] || tipoConfig.sistema;
                return (
                  <div
                    key={n._id}
                    className={`bell-item ${!n.letta ? 'bell-item--nuova' : ''}`}
                    onClick={() => handleClick(n)}
                  >
                    {/* Pallino non letta */}
                    {!n.letta && <span className="bell-item__dot" />}

                    {/* Emoji tipo */}
                    <div className="bell-item__icon" style={{ background: cfg.colore + '22', color: cfg.colore }}>
                      {cfg.emoji}
                    </div>

                    {/* Testo */}
                    <div className="bell-item__body">
                      <p className="bell-item__titolo">{n.titolo}</p>
                      <p className="bell-item__msg">{n.messaggio}</p>
                      <p className="bell-item__time">{tempoFa(n.createdAt)}</p>
                    </div>

                    {/* Elimina */}
                    <button
                      className="bell-item__del"
                      onClick={e => { e.stopPropagation(); eliminaNotifica(n._id); }}
                      title="Elimina"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifiche.length > 0 && (
            <div className="bell-dropdown__footer">
              <button onClick={() => { navigate('/notifiche'); setAperto(false); }}>
                Vedi tutte le notifiche →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
