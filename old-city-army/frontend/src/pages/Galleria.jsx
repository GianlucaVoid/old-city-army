import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import './PageCommon.css';

// ─── Componente Upload ────────────────────────────────────────────────────────
const UploadFoto = ({ onSuccess }) => {
  const [preview,   setPreview]   = useState(null);
  const [file,      setFile]      = useState(null);
  const [titolo,    setTitolo]    = useState('');
  const [categoria, setCategoria] = useState('misc');
  const [loading,   setLoading]   = useState(false);
  const [errore,    setErrore]    = useState('');
  const inputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrore('File troppo grande. Massimo 5MB.'); return; }
    setFile(f); setErrore('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile({ target: { files: [f] } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setErrore('Scegli una foto.'); return; }
    setLoading(true); setErrore('');
    try {
      const formData = new FormData();
      formData.append('foto', file);
      formData.append('titolo', titolo);
      formData.append('categoria', categoria);
      const { data } = await axios.post('/api/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null); setPreview(null); setTitolo(''); setCategoria('misc');
      onSuccess(data);
    } catch (err) {
      setErrore(err.response?.data?.errore || 'Errore nel caricamento.');
    } finally { setLoading(false); }
  };

  const handleReset = () => { setFile(null); setPreview(null); setErrore(''); };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px', marginBottom: '48px' }}>
      <p className="section-label" style={{ marginBottom: '24px' }}>📤 Carica una foto</p>
      <form onSubmit={handleSubmit}>
        {/* Drop zone */}
        <div
          onClick={() => !preview && inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            border: `2px dashed ${preview ? 'var(--color-orange)' : 'var(--color-border)'}`,
            borderRadius: '4px', padding: preview ? '16px' : '48px 24px',
            textAlign: 'center', cursor: preview ? 'default' : 'pointer',
            marginBottom: '20px', transition: 'border-color 0.2s',
            background: preview ? 'rgba(232,68,26,0.04)' : 'transparent',
          }}
        >
          {preview ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={preview} alt="anteprima" style={{ maxHeight: '220px', maxWidth: '100%', borderRadius: '4px', display: 'block', margin: '0 auto' }} />
              <button type="button" onClick={handleReset} style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-orange)', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>✕</button>
              <p style={{ color: 'var(--color-gray)', fontSize: '12px', marginTop: '10px' }}>{file?.name}</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '44px', marginBottom: '14px' }}>📸</div>
              <p style={{ color: 'var(--color-white)', fontSize: '15px', marginBottom: '6px' }}>Clicca o trascina una foto qui</p>
              <p style={{ color: 'var(--color-gray-dim)', fontSize: '12px' }}>JPG, PNG, WEBP — max 5MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Titolo (opzionale)</label>
            <input type="text" value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="es. Raduno Estate 2024" />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-white)', padding: '14px 16px', borderRadius: '4px', fontSize: '15px', outline: 'none' }}>
              <option value="misc">Generale</option>
              <option value="moto">Moto</option>
              <option value="raduno">Raduno</option>
              <option value="percorso">Percorso</option>
            </select>
          </div>
        </div>

        {errore && <p style={{ color: 'var(--color-orange)', fontSize: '13px', marginBottom: '16px' }}>⚠️ {errore}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading || !file} style={{ width: '100%', opacity: !file ? 0.5 : 1 }}>
          {loading ? '⏳ Caricamento in corso...' : '📤 Pubblica foto'}
        </button>
      </form>
    </div>
  );
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
        <img src={item.url} alt={item.titolo} style={{ width: '100%', borderRadius: '4px', maxHeight: '80vh', objectFit: 'contain' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            {item.titolo && <p style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700 }}>{item.titolo}</p>}
            <p style={{ color: 'var(--color-gray)', fontSize: '13px', marginTop: '4px' }}>
              {item.autore?.nome} {item.autore?.cognome} · ❤️ {item.likes?.length || 0}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-white)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '13px' }}>✕ Chiudi</button>
        </div>
      </div>
    </div>
  );
};

// ─── Galleria principale ──────────────────────────────────────────────────────
const Galleria = () => {
  const { user }                    = useAuth();
  const [cat, setCat]               = useState('');
  const [lightbox, setLightbox]     = useState(null);
  const [extraItems, setExtraItems] = useState([]);

  const { data: fetched, loading } = useApi(
    `/api/gallery${cat ? `?categoria=${cat}` : ''}`,
    [cat]
  );

  const items = [...extraItems, ...(fetched || [])];

  const categorie = [
    { value: '',         label: 'Tutte' },
    { value: 'moto',     label: 'Moto' },
    { value: 'raduno',   label: 'Raduni' },
    { value: 'percorso', label: 'Percorsi' },
    { value: 'misc',     label: 'Altro' },
  ];

  return (
    <main className="page">
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />

      <div className="page__hero container">
        <p className="section-label">Immagini</p>
        <h1 className="page__title">Galleria</h1>
        <p className="page__sub">I momenti della nostra fratellanza su due ruote.</p>
        <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categorie.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)} style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 20px', cursor: 'pointer', border: `1px solid ${cat === c.value ? 'var(--color-orange)' : 'var(--color-border)'}`, color: cat === c.value ? 'var(--color-orange)' : 'var(--color-gray)', background: cat === c.value ? 'rgba(232,68,26,0.08)' : 'transparent', transition: 'all 0.2s ease', borderRadius: '2px' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 100px' }}>
        {user && <UploadFoto onSuccess={(nuovaFoto) => setExtraItems(prev => [nuovaFoto, ...prev])} />}

        {loading && <div className="loading" style={{ padding: '80px 0' }}>Caricamento galleria...</div>}

        <div className="gallery-grid">
          {items.map(item => (
            <div key={item._id} className="gallery-item" onClick={() => setLightbox(item)}>
              <img src={item.url} alt={item.titolo || 'OCA photo'} loading="lazy" />
              <div className="gallery-item__overlay">
                {item.titolo && <span style={{ fontWeight: 700, marginBottom: 4, textAlign: 'center', padding: '0 8px' }}>{item.titolo}</span>}
                <span>❤️ {item.likes?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 && (
          <p className="empty-state" style={{ padding: '60px 0', textAlign: 'center' }}>Nessuna foto in questa categoria.</p>
        )}
      </div>
    </main>
  );
};

export default Galleria;
