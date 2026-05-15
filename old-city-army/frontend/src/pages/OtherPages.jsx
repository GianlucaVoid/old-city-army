// pages/Percorsi.jsx
import React from 'react';
import { useApi } from '../hooks/useApi';
import './PageCommon.css';

export const Percorsi = () => {
  const { data: percorsi, loading } = useApi('/api/routes');
  const colori = { facile: '#22c55e', medio: '#f59e0b', difficile: '#ef4444', esperto: '#a855f7' };

  return (
    <main className="page">
      <div className="page__hero container">
        <p className="section-label">Itinerari</p>
        <h1 className="page__title">Percorsi</h1>
        <p className="page__sub">I migliori tracciati selezionati dai nostri membri.</p>
      </div>
      <div className="container page__content">
        {loading && <div className="loading">Caricamento percorsi...</div>}
        <div className="percorsi-grid">
          {(percorsi || []).map(p => (
            <article key={p._id} className="percorso-card">
              <h3>{p.nome}</h3>
              <div className="percorso-card__meta">
                <span>🛣️ {p.distanzaKm} km</span>
                <span>⏱️ {p.durata}</span>
                <span
                  className="percorso-card__difficolta"
                  style={{ color: colori[p.difficolta] }}
                >
                  {p.difficolta}
                </span>
              </div>
              <p>{p.descrizione}</p>
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-gray-dim)' }}>
                {p.partenza} → {p.arrivo}
              </p>
            </article>
          ))}
          {percorsi && percorsi.length === 0 && (
            <p className="empty-state">Nessun percorso disponibile.</p>
          )}
        </div>
      </div>
    </main>
  );
};

// pages/ChiSiamo.jsx
export const ChiSiamo = () => (
  <main className="page">
    <div className="page__hero container">
      <p className="section-label">La nostra storia</p>
      <h1 className="page__title">Chi Siamo</h1>
    </div>
    <div className="container page__content" style={{ maxWidth: '760px' }}>
      <p style={{ fontSize: '20px', lineHeight: '1.8', color: 'var(--color-gray)', marginBottom: '32px' }}>
        Old City Army nasce nel 2025 tra le strade di Civitavecchia, da un gruppo
        di appassionati che volevano qualcosa di più di una semplice uscita in moto.
        Volevamo una famiglia.
      </p>
      {[
        ['La nostra filosofia', 'Non importa chi sei, quanti anni hai o che moto guidi. Quello che conta è il rispetto: per la strada, per i compagni, per te stesso. La moto è il mezzo, la fratellanza è la meta.'],
        ['Come funziona', 'Organizziamo raduni mensili, gite fuori porta e uscite settimanali. Ogni membro porta la propria storia e la propria moto. Insieme costruiamo ricordi che durano.'],
        ['I nostri valori', 'Rispetto, libertà e solidarietà. Aiutiamo i nuovi arrivati, supportiamo chi è in difficoltà, festeggiamo insieme ogni chilometro percorso.'],
      ].map(([t, b]) => (
        <div key={t} style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', textTransform: 'uppercase', color: 'var(--color-orange)', marginBottom: '16px' }}>{t}</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--color-gray)' }}>{b}</p>
        </div>
      ))}
    </div>
  </main>
);

// pages/Blog.jsx
export const Blog = () => {
  const { data: posts, loading } = useApi('/api/blog');
  return (
    <main className="page">
      <div className="page__hero container">
        <p className="section-label">Notizie</p>
        <h1 className="page__title">Blog</h1>
      </div>
      <div className="container page__content">
        {loading && <div className="loading">Caricamento articoli...</div>}
        <div style={{ display: 'grid', gap: '2px' }}>
          {(posts || []).map(post => (
            <article key={post._id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              gap: '32px', padding: '32px 0',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-orange)', marginBottom: '12px' }}>
                  {new Date(post.createdAt).toLocaleDateString('it-IT')} · {post.autore?.nome} {post.autore?.cognome}
                </p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{post.titolo}</h2>
                <p style={{ color: 'var(--color-gray)', fontSize: '14px', lineHeight: '1.7' }}>{post.estratto}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-gray-dim)', fontSize: '12px' }}>👁 {post.visite}</span>
              </div>
            </article>
          ))}
          {posts && posts.length === 0 && <p className="empty-state">Nessun articolo pubblicato.</p>}
        </div>
      </div>
    </main>
  );
};

// pages/FAQ.jsx
const faqs = [
  { q: 'Come posso diventare un membro?', r: 'Clicca su "Diventa un Membro", registra il tuo account e partecipa al primo raduno disponibile. La procedura è semplice e gratuita.' },
  { q: 'Che tipo di moto bisogna avere?', r: 'Nessun requisito. Custom, naked, enduro, scooter: l\'importante è la passione e il rispetto per la strada.' },
  { q: 'Ci sono quote di iscrizione?', r: 'L\'iscrizione al sito è gratuita. Alcuni eventi speciali potrebbero avere un contributo spese per l\'organizzazione.' },
  { q: 'Dove si svolgono i raduni?', r: 'Prevalentemente nella nostra area, ma organizziamo anche uscite in tutta Italia e qualche avventura all\'estero.' },
  { q: 'Posso portare amici non iscritti?', r: 'Assolutamente sì! Gli amici sono sempre benvenuti. Per partecipare regolarmente ti invitiamo a registrarti.' },
];

export const FAQ = () => (
  <main className="page">
    <div className="page__hero container">
      <p className="section-label">Domande frequenti</p>
      <h1 className="page__title">FAQ</h1>
    </div>
    <div className="container page__content" style={{ maxWidth: '720px' }}>
      {faqs.map(({ q, r }) => (
        <details key={q} style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '24px 0',
        }}>
          <summary style={{
            fontFamily: 'var(--font-heading)', fontSize: '18px',
            fontWeight: 700, cursor: 'pointer', listStyle: 'none',
            display: 'flex', justifyContent: 'space-between',
          }}>
            {q}
            <span style={{ color: 'var(--color-orange)', fontSize: '20px' }}>+</span>
          </summary>
          <p style={{ marginTop: '16px', color: 'var(--color-gray)', lineHeight: '1.7', fontSize: '15px' }}>{r}</p>
        </details>
      ))}
    </div>
  </main>
);
