import React from 'react';
import { useApi } from '../hooks/useApi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './PageCommon.css';

const Raduni = () => {
  const { data: events, loading, error, setData } = useApi('/api/events');
  const { user } = useAuth();

  const handlePartecipa = async (id) => {
    try {
      const { data } = await axios.post(`/api/events/${id}/partecipa`);
      setData(prev => prev.map(ev =>
        ev._id === id
          ? { ...ev, partecipanti: data.iscritto
              ? [...(ev.partecipanti || []), { _id: user._id, nome: user.nome }]
              : (ev.partecipanti || []).filter(p => p._id !== user._id)
            }
          : ev
      ));
    } catch (err) {
      alert(err.response?.data?.errore || 'Effettua il login per partecipare.');
    }
  };

  return (
    <main className="page">
      <div className="page__hero container">
        <p className="section-label">Calendario</p>
        <h1 className="page__title">Raduni</h1>
        <p className="page__sub">Tutti gli appuntamenti della Old City Army. Unisciti a noi.</p>
      </div>

      <div className="container page__content">
        {loading && <div className="loading">Caricamento raduni...</div>}
        {error   && <div className="error">Errore: {error}</div>}
        {events && events.length === 0 && (
          <p className="empty-state">Nessun raduno in programma.</p>
        )}
        {events && events.map(ev => {
          const isIscritto = user && ev.partecipanti?.some(p => p._id === user._id);
          return (
            <article key={ev._id} className="event-row">
              <div className="event-row__date">
                <span className="event-row__day">{new Date(ev.data).getDate()}</span>
                <span className="event-row__month">
                  {new Date(ev.data).toLocaleString('it-IT', { month: 'short' })}
                </span>
                <span className="event-row__year">{new Date(ev.data).getFullYear()}</span>
              </div>
              <div className="event-row__info">
                <h2>{ev.titolo}</h2>
                <p className="event-row__luogo">📍 {ev.luogo}</p>
                <p className="event-row__desc">{ev.descrizione}</p>
              </div>
              <div className="event-row__action">
                <p className="event-row__count">
                  <strong>{ev.partecipanti?.length || 0}</strong> partecipanti
                </p>
                <button
                  className={`btn ${isIscritto ? 'btn--outline' : 'btn--primary'}`}
                  onClick={() => handlePartecipa(ev._id)}
                >
                  {isIscritto ? 'Disdici' : 'Partecipa'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Raduni;
