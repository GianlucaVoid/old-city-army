import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import './Home.css';

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
const Hero = () => (
  <section className="hero">
    <div className="hero__bg-text" aria-hidden="true">OLD CITY</div>
    <div className="hero__overlay" />
    <div className="hero__content container">
      <p className="section-label hero__label fade-up" style={{ animationDelay: '0.1s' }}>
        Old City Army
      </p>
      <h1 className="hero__title fade-up" style={{ animationDelay: '0.25s' }}>
        Fratellanza<br />su due ruote<br />vivila, guidala,<br />condividila
      </h1>
      <p className="hero__sub fade-up" style={{ animationDelay: '0.45s' }}>
        Non importa chi sei, quanti anni hai o quanto fai rumore:<br />
        quello che conta è come vivi la strada e che rispetto porti.
      </p>
      <div className="hero__ctas fade-up" style={{ animationDelay: '0.6s' }}>
        <Link to="/chi-siamo" className="btn btn--primary">Scopri Chi Siamo</Link>
        <Link to="/raduni"    className="btn btn--outline">Prossimo Raduno</Link>
      </div>
    </div>
    <div className="hero__scroll-hint" aria-hidden="true">
      <span />
    </div>
  </section>
);

/* ─── Stats bar ─────────────────────────────────────────────────────────────── */
const Stats = () => (
  <div className="stats container">
    {[
      { n: '0+', label: 'Membri attivi' },
      { n: '0+', label: 'Raduni organizzati' },
      { n: '0+',  label: 'Percorsi mappati' },
      { n: '1+',  label: 'Anni di storia' },
    ].map(({ n, label }) => (
      <div key={label} className="stats__item">
        <span className="stats__number">{n}</span>
        <span className="stats__label">{label}</span>
      </div>
    ))}
  </div>
);

/* ─── Prossimi Raduni preview ────────────────────────────────────────────────── */
const RaduniPreview = ({ events }) => (
  <section className="section">
    <div className="container">
      <div className="section__header">
        <p className="section-label">Agenda</p>
        <h2 className="section__title">Prossimi Raduni</h2>
        <Link to="/raduni" className="section__more">Vedi tutti →</Link>
      </div>
      <div className="events-grid">
        {(events || []).slice(0, 3).map(ev => (
          <article key={ev._id} className="event-card">
            <div className="event-card__date">
              <span className="event-card__day">{new Date(ev.data).getDate()}</span>
              <span className="event-card__month">
                {new Date(ev.data).toLocaleString('it-IT', { month: 'short' })}
              </span>
            </div>
            <div className="event-card__info">
              <h3>{ev.titolo}</h3>
              <p className="event-card__luogo">📍 {ev.luogo}</p>
              <p className="event-card__partecipanti">
                {ev.partecipanti?.length || 0} partecipanti
              </p>
            </div>
          </article>
        ))}
        {(!events || events.length === 0) && (
          <p className="empty-state">Nessun raduno in programma al momento.</p>
        )}
      </div>
    </div>
  </section>
);

/* ─── Home page ─────────────────────────────────────────────────────────────── */
const Home = () => {
  const { data: events } = useApi('/api/events');

  return (
    <main>
      <Hero />
      <Stats />
      <RaduniPreview events={events} />

      {/* Chi siamo teaser */}
      <section className="section section--dark">
        <div className="container about-teaser">
          <div className="about-teaser__text">
            <p className="section-label">Chi Siamo</p>
            <h2 className="section__title">Una fratellanza nata per strada</h2>
            <p>
              Old City Army non è solo un moto club. È una famiglia. Un'idea.
              Un modo di vivere la moto con rispetto, passione e libertà.
              Siamo nati tra le strade della vecchia città e da lì non ci siamo
              mai fermati.
            </p>
            <Link to="/chi-siamo" className="btn btn--primary" style={{ marginTop: '32px' }}>
              La Nostra Storia
            </Link>
          </div>
          <div className="about-teaser__visual">
            <div className="about-teaser__badge">
              <span className="about-teaser__badge-text">O.C.A.</span>
              <span className="about-teaser__badge-sub">EST. 2025</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
