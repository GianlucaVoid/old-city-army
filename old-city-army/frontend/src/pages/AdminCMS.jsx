import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import './PageCommon.css';
import './AdminCMS.css';

// ─── Form Raduno ──────────────────────────────────────────────────────────────
const FormRaduno = ({ evento, onSave, onCancel }) => {
  const [form, setForm] = useState({
    titolo:      evento?.titolo      || '',
    descrizione: evento?.descrizione || '',
    data:        evento?.data ? new Date(evento.data).toISOString().slice(0,16) : '',
    luogo:       evento?.luogo       || '',
    tipo:        evento?.tipo        || 'raduno',
    maxPartecipanti: evento?.maxPartecipanti || 0,
    immagine:    evento?.immagine    || '',
  });
  const [loading, setLoading] = useState(false);
  const [errore,  setErrore]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setErrore('');
    try {
      if (evento) {
        await axios.put(`/api/events/${evento._id}`, form);
      } else {
        await axios.post('/api/events', form);
      }
      onSave();
    } catch (err) {
      setErrore(err.response?.data?.errore || 'Errore nel salvataggio.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      <div className="cms-form__grid">
        <div className="form-group">
          <label>Titolo *</label>
          <input name="titolo" value={form.titolo} onChange={handleChange} required placeholder="es. Raduno Estivo 2024" />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="cms-select">
            <option value="raduno">Raduno</option>
            <option value="gita">Gita</option>
            <option value="evento_speciale">Evento Speciale</option>
          </select>
        </div>
      </div>
      <div className="cms-form__grid">
        <div className="form-group">
          <label>Data e ora *</label>
          <input name="data" type="datetime-local" value={form.data} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Luogo *</label>
          <input name="luogo" value={form.luogo} onChange={handleChange} required placeholder="es. Roma, Piazza del Popolo" />
        </div>
      </div>
      <div className="form-group">
        <label>Descrizione *</label>
        <textarea name="descrizione" value={form.descrizione} onChange={handleChange} required rows={4} placeholder="Descrivi il raduno..." />
      </div>
      <div className="cms-form__grid">
        <div className="form-group">
          <label>URL Immagine copertina</label>
          <input name="immagine" value={form.immagine} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Max partecipanti (0 = illimitati)</label>
          <input name="maxPartecipanti" type="number" value={form.maxPartecipanti} onChange={handleChange} min={0} />
        </div>
      </div>
      {errore && <p className="form-error">{errore}</p>}
      <div className="cms-form__actions">
        <button type="button" className="btn btn--outline" onClick={onCancel}>Annulla</button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Salvataggio...' : evento ? '💾 Aggiorna raduno' : '➕ Crea raduno'}
        </button>
      </div>
    </form>
  );
};

// ─── Form Percorso ────────────────────────────────────────────────────────────
const FormPercorso = ({ percorso, onSave, onCancel }) => {
  const [form, setForm] = useState({
    nome:        percorso?.nome        || '',
    descrizione: percorso?.descrizione || '',
    distanzaKm:  percorso?.distanzaKm  || '',
    difficolta:  percorso?.difficolta  || 'medio',
    partenza:    percorso?.partenza    || '',
    arrivo:      percorso?.arrivo      || '',
    durata:      percorso?.durata      || '',
    gpxFile:     percorso?.gpxFile     || '',
  });
  const [loading, setLoading] = useState(false);
  const [errore,  setErrore]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setErrore('');
    try {
      if (percorso) {
        await axios.put(`/api/routes/${percorso._id}`, form);
      } else {
        await axios.post('/api/routes', form);
      }
      onSave();
    } catch (err) {
      setErrore(err.response?.data?.errore || 'Errore nel salvataggio.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      <div className="cms-form__grid">
        <div className="form-group">
          <label>Nome percorso *</label>
          <input name="nome" value={form.nome} onChange={handleChange} required placeholder="es. Giro dei Castelli Romani" />
        </div>
        <div className="form-group">
          <label>Difficoltà</label>
          <select name="difficolta" value={form.difficolta} onChange={handleChange} className="cms-select">
            <option value="facile">Facile</option>
            <option value="medio">Medio</option>
            <option value="difficile">Difficile</option>
            <option value="esperto">Esperto</option>
          </select>
        </div>
      </div>
      <div className="cms-form__grid">
        <div className="form-group">
          <label>Partenza *</label>
          <input name="partenza" value={form.partenza} onChange={handleChange} required placeholder="es. Roma Centro" />
        </div>
        <div className="form-group">
          <label>Arrivo *</label>
          <input name="arrivo" value={form.arrivo} onChange={handleChange} required placeholder="es. Frascati" />
        </div>
      </div>
      <div className="cms-form__grid">
        <div className="form-group">
          <label>Distanza (km) *</label>
          <input name="distanzaKm" type="number" value={form.distanzaKm} onChange={handleChange} required min={1} placeholder="es. 85" />
        </div>
        <div className="form-group">
          <label>Durata stimata</label>
          <input name="durata" value={form.durata} onChange={handleChange} placeholder="es. 2 ore e mezza" />
        </div>
      </div>
      <div className="form-group">
        <label>Descrizione *</label>
        <textarea name="descrizione" value={form.descrizione} onChange={handleChange} required rows={4} placeholder="Descrivi il percorso, i punti di interesse..." />
      </div>
      <div className="form-group">
        <label>Link file GPX (opzionale)</label>
        <input name="gpxFile" value={form.gpxFile} onChange={handleChange} placeholder="https://..." />
      </div>
      {errore && <p className="form-error">{errore}</p>}
      <div className="cms-form__actions">
        <button type="button" className="btn btn--outline" onClick={onCancel}>Annulla</button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Salvataggio...' : percorso ? '💾 Aggiorna percorso' : '➕ Crea percorso'}
        </button>
      </div>
    </form>
  );
};

// ─── Form Blog ────────────────────────────────────────────────────────────────
const FormBlog = ({ post, onSave, onCancel }) => {
  const [form, setForm] = useState({
    titolo:    post?.titolo    || '',
    estratto:  post?.estratto  || '',
    contenuto: post?.contenuto || '',
    immagine:  post?.immagine  || '',
    tags:      post?.tags?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [errore,  setErrore]  = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setErrore('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (post) {
        await axios.put(`/api/blog/${post._id}`, payload);
      } else {
        await axios.post('/api/blog', payload);
      }
      onSave();
    } catch (err) {
      setErrore(err.response?.data?.errore || 'Errore nel salvataggio.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      <div className="form-group">
        <label>Titolo *</label>
        <input name="titolo" value={form.titolo} onChange={handleChange} required placeholder="es. Il nostro raduno di agosto" />
      </div>
      <div className="form-group">
        <label>Estratto (max 300 caratteri)</label>
        <textarea name="estratto" value={form.estratto} onChange={handleChange} rows={2} maxLength={300} placeholder="Breve descrizione che appare in anteprima..." />
        <span className="char-count">{form.estratto.length}/300</span>
      </div>
      <div className="form-group">
        <label>Contenuto *</label>
        <textarea name="contenuto" value={form.contenuto} onChange={handleChange} required rows={10} placeholder="Scrivi qui l'articolo completo..." />
      </div>
      <div className="cms-form__grid">
        <div className="form-group">
          <label>URL immagine copertina</label>
          <input name="immagine" value={form.immagine} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Tag (separati da virgola)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="es. raduno, estate, roma" />
        </div>
      </div>
      {errore && <p className="form-error">{errore}</p>}
      <div className="cms-form__actions">
        <button type="button" className="btn btn--outline" onClick={onCancel}>Annulla</button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Pubblicazione...' : post ? '💾 Aggiorna articolo' : '📝 Pubblica articolo'}
        </button>
      </div>
    </form>
  );
};

// ─── Lista generica con edit/delete ──────────────────────────────────────────
const ListaElementi = ({ items, onEdit, onDelete, renderItem }) => (
  <div className="cms-list">
    {(items || []).length === 0 && (
      <p className="empty-state">Nessun elemento. Creane uno!</p>
    )}
    {(items || []).map(item => (
      <div key={item._id} className="cms-list__item">
        <div className="cms-list__info">{renderItem(item)}</div>
        <div className="cms-list__actions">
          <button className="cms-btn-edit" onClick={() => onEdit(item)}>✏️ Modifica</button>
          <button className="cms-btn-delete" onClick={() => onDelete(item._id)}>🗑 Elimina</button>
        </div>
      </div>
    ))}
  </div>
);

// ─── Sezione Raduni ───────────────────────────────────────────────────────────
const SezioneRaduni = () => {
  const { data: events, loading, setData } = useApi('/api/events');
  const [form,     setForm]     = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [feedback, setFeedback] = useState('');

  const mostraFeedback = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

  const handleSave = async () => {
    const { data } = await axios.get('/api/events');
    setData(data);
    setForm(false); setEditing(null);
    mostraFeedback('✅ Raduno salvato!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questo raduno?')) return;
    await axios.delete(`/api/events/${id}`);
    setData(prev => prev.filter(e => e._id !== id));
    mostraFeedback('🗑 Raduno eliminato.');
  };

  if (loading) return <div className="loading">Caricamento...</div>;

  return (
    <div>
      {feedback && <div className="cms-feedback">{feedback}</div>}
      {!form && !editing && (
        <button className="btn btn--primary cms-new-btn" onClick={() => setForm(true)}>
          ➕ Nuovo Raduno
        </button>
      )}
      {(form || editing) && (
        <FormRaduno
          evento={editing}
          onSave={handleSave}
          onCancel={() => { setForm(false); setEditing(null); }}
        />
      )}
      {!form && !editing && (
        <ListaElementi
          items={events}
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
          renderItem={(ev) => (
            <>
              <p className="cms-item__title">{ev.titolo}</p>
              <p className="cms-item__meta">
                📅 {new Date(ev.data).toLocaleDateString('it-IT')} &nbsp;·&nbsp;
                📍 {ev.luogo} &nbsp;·&nbsp;
                👥 {ev.partecipanti?.length || 0} iscritti
              </p>
            </>
          )}
        />
      )}
    </div>
  );
};

// ─── Sezione Percorsi ─────────────────────────────────────────────────────────
const SezionePercorsi = () => {
  const { data: percorsi, loading, setData } = useApi('/api/routes');
  const [form,    setForm]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback,setFeedback]= useState('');

  const mostraFeedback = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

  const handleSave = async () => {
    const { data } = await axios.get('/api/routes');
    setData(data);
    setForm(false); setEditing(null);
    mostraFeedback('✅ Percorso salvato!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questo percorso?')) return;
    await axios.delete(`/api/routes/${id}`);
    setData(prev => prev.filter(p => p._id !== id));
    mostraFeedback('🗑 Percorso eliminato.');
  };

  if (loading) return <div className="loading">Caricamento...</div>;

  const coloriDiff = { facile: '#22c55e', medio: '#f59e0b', difficile: '#ef4444', esperto: '#a855f7' };

  return (
    <div>
      {feedback && <div className="cms-feedback">{feedback}</div>}
      {!form && !editing && (
        <button className="btn btn--primary cms-new-btn" onClick={() => setForm(true)}>
          ➕ Nuovo Percorso
        </button>
      )}
      {(form || editing) && (
        <FormPercorso
          percorso={editing}
          onSave={handleSave}
          onCancel={() => { setForm(false); setEditing(null); }}
        />
      )}
      {!form && !editing && (
        <ListaElementi
          items={percorsi}
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
          renderItem={(p) => (
            <>
              <p className="cms-item__title">{p.nome}</p>
              <p className="cms-item__meta">
                🛣️ {p.distanzaKm} km &nbsp;·&nbsp;
                {p.partenza} → {p.arrivo} &nbsp;·&nbsp;
                <span style={{ color: coloriDiff[p.difficolta], fontWeight: 700 }}>{p.difficolta}</span>
              </p>
            </>
          )}
        />
      )}
    </div>
  );
};

// ─── Sezione Blog ─────────────────────────────────────────────────────────────
const SezioneBlog = () => {
  const { data: posts, loading, setData } = useApi('/api/blog');
  const [form,    setForm]    = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback,setFeedback]= useState('');

  const mostraFeedback = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

  const handleSave = async () => {
    const { data } = await axios.get('/api/blog');
    setData(data);
    setForm(false); setEditing(null);
    mostraFeedback('✅ Articolo pubblicato!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questo articolo?')) return;
    await axios.delete(`/api/blog/${id}`);
    setData(prev => prev.filter(p => p._id !== id));
    mostraFeedback('🗑 Articolo eliminato.');
  };

  if (loading) return <div className="loading">Caricamento...</div>;

  return (
    <div>
      {feedback && <div className="cms-feedback">{feedback}</div>}
      {!form && !editing && (
        <button className="btn btn--primary cms-new-btn" onClick={() => setForm(true)}>
          ➕ Nuovo Articolo
        </button>
      )}
      {(form || editing) && (
        <FormBlog
          post={editing}
          onSave={handleSave}
          onCancel={() => { setForm(false); setEditing(null); }}
        />
      )}
      {!form && !editing && (
        <ListaElementi
          items={posts}
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
          renderItem={(post) => (
            <>
              <p className="cms-item__title">{post.titolo}</p>
              <p className="cms-item__meta">
                📅 {new Date(post.createdAt).toLocaleDateString('it-IT')} &nbsp;·&nbsp;
                👁 {post.visite} visite
                {post.tags?.length > 0 && ` · 🏷 ${post.tags.join(', ')}`}
              </p>
            </>
          )}
        />
      )}
    </div>
  );
};

// ─── Pagina principale CMS ────────────────────────────────────────────────────
const TABS = [
  { id: 'raduni',   label: '🏍️ Raduni' },
  { id: 'percorsi', label: '🛣️ Percorsi' },
  { id: 'blog',     label: '📝 Blog' },
];

const AdminCMS = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('raduni');

  if (!user) return <Navigate to="/login" replace />;
  if (user.ruolo !== 'admin' && user.ruolo !== 'presidente') {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page">
      <div className="page__hero container">
        <p className="section-label">Gestione contenuti</p>
        <h1 className="page__title">CMS</h1>
        <p className="page__sub">Aggiungi, modifica ed elimina raduni, percorsi e articoli direttamente da qui.</p>
      </div>

      {/* Tab bar */}
      <div className="cms-tabs">
        <div className="container cms-tabs__inner">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`cms-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenuto */}
      <div className="container cms-body">
        {tab === 'raduni'   && <SezioneRaduni />}
        {tab === 'percorsi' && <SezionePercorsi />}
        {tab === 'blog'     && <SezioneBlog />}
      </div>
    </main>
  );
};

export default AdminCMS;
