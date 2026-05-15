import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth }      from '../context/AuthContext';
import { useNotifiche } from '../context/NotificheContext';
import './PageCommon.css';

const tipoConfig = {
  nuovo_raduno:      { emoji: '🏍️', colore: '#e8441a', label: 'Raduno' },
  raduno_aggiornato: { emoji: '📝', colore: '#f59e0b', label: 'Aggiornamento' },
  nuovo_post:        { emoji: '📰', colore: '#3b82f6', label: 'Blog' },
  like_foto:         { emoji: '❤️', colore: '#ec4899', label: 'Like' },
  nuovo_membro:      { emoji: '👤', colore: '#22c55e', label: 'Membro' },
  sistema:           { emoji: '🔔', colore: '#a855f7', label: 'Sistema' },
};

const tempoFa = (data) => {
  const diff = Date.now() - new Date(data).getTime();
  const min  = Math.floor(diff / 60000);
  const ore  = Math.floor(min / 60);
  const gg   = Math.floor(ore / 24);
  if (min < 1)   return 'adesso';
  if (min < 60)  return `${min} minuti fa`;
  if (ore < 24)  return `${ore} ore fa`;
  if (gg < 7)    return `${gg} giorni fa`;
  return new Date(data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
};

const Notifiche = () => {
  const { user } = useAuth();
  const { notifiche, nonLette, segnaLetta, segnaLetteTutte, eliminaNotifica, eliminaTutte } = useNotifiche();
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('tutte'); // tutte | nonLette

  if (!user) return <Navigate to="/login" replace />;

  const lista = filtro === 'nonLette'
    ? notifiche.filter(n => !n.letta)
    : notifiche;

  const handleClick = (n) => {
    if (!n.letta) segnaLetta(n._id);
    if (n.link)   navigate(n.link);
  };

  return (
    <main className="page">
      <div className="page__hero container">
        <p className="section-label">Centro notifiche</p>
        <h1 className="page__title">Notifiche</h1>
        {nonLette > 0 && (
          <p className="page__sub">{nonLette} notifiche non lette</p>
        )}
      </div>

      <div className="container page__content" style={{ maxWidth: '720px' }}>
        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Filtri */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['tutte', 'Tutte'], ['nonLette', 'Non lette']].map(([val, label]) => (
              <button key={val} onClick={() => setFiltro(val)} style={{
                fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 18px',
                border: `1px solid ${filtro === val ? 'var(--color-orange)' : 'var(--color-border)'}`,
                color: filtro === val ? 'var(--color-orange)' : 'var(--color-gray)',
                background: filtro === val ? 'rgba(232,68,26,0.08)' : 'transparent',
                cursor: 'pointer', borderRadius: '2px', transition: 'all 0.2s',
              }}>
                {label}
                {val === 'nonLette' && nonLette > 0 && (
                  <span style={{ marginLeft: '6px', background: 'var(--color-orange)', color: 'white', fontSize: '10px', padding: '1px 6px', borderRadius: '100px' }}>
                    {nonLette}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Azioni */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {nonLette > 0 && (
              <button onClick={segnaLetteTutte} style={{ fontSize: '13px', color: 'var(--color-orange)', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                ✓ Segna tutte lette
              </button>
            )}
            {notifiche.length > 0 && (
              <button onClick={eliminaTutte} style={{ fontSize: '13px', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                🗑 Elimina tutte
              </button>
            )}
          </div>
        </div>

        {/* ── Lista ── */}
        {lista.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-gray)' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔔</div>
            <p style={{ fontSize: '16px' }}>
              {filtro === 'nonLette' ? 'Nessuna notifica non letta.' : 'Nessuna notifica.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {lista.map(n => {
              const cfg = tipoConfig[n.tipo] || tipoConfig.sistema;
              return (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr auto',
                    gap: '16px',
                    alignItems: 'start',
                    padding: '20px 24px',
                    background: n.letta ? 'var(--color-surface)' : 'rgba(232,68,26,0.06)',
                    border: `1px solid ${n.letta ? 'var(--color-border)' : 'rgba(232,68,26,0.2)'}`,
                    cursor: n.link ? 'pointer' : 'default',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (n.link) e.currentTarget.style.background = n.letta ? 'rgba(255,255,255,0.03)' : 'rgba(232,68,26,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = n.letta ? 'var(--color-surface)' : 'rgba(232,68,26,0.06)'; }}
                >
                  {/* Icona */}
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: cfg.colore + '22', color: cfg.colore,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>
                    {cfg.emoji}
                  </div>

                  {/* Testo */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700 }}>
                        {n.titolo}
                      </p>
                      {!n.letta && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-orange)', display: 'inline-block', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: cfg.colore, border: `1px solid ${cfg.colore}22`, padding: '2px 8px', borderRadius: '100px' }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: '1.5', marginBottom: '6px' }}>
                      {n.messaggio}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-gray-dim)' }}>
                      {n.mittente ? `${n.mittente.nome} ${n.mittente.cognome} · ` : ''}{tempoFa(n.createdAt)}
                    </p>
                  </div>

                  {/* Elimina */}
                  <button
                    onClick={e => { e.stopPropagation(); eliminaNotifica(n._id); }}
                    title="Elimina notifica"
                    style={{ color: 'var(--color-gray-dim)', fontSize: '14px', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s, color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-gray-dim)'; }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Notifiche;
