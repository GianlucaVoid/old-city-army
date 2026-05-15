import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadFoto = ({ onSuccess }) => {
  const [preview,    setPreview]    = useState(null);
  const [file,       setFile]       = useState(null);
  const [titolo,     setTitolo]     = useState('');
  const [categoria,  setCategoria]  = useState('misc');
  const [loading,    setLoading]    = useState(false);
  const [errore,     setErrore]     = useState('');
  const inputRef = useRef();

  // Quando l'utente sceglie un file — mostra anteprima
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    // Controllo dimensione lato client (max 5MB)
    if (f.size > 5 * 1024 * 1024) {
      setErrore('Il file è troppo grande. Massimo 5MB.');
      return;
    }

    setFile(f);
    setErrore('');

    // Crea un URL temporaneo per l'anteprima
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setErrore('Scegli una foto.'); return; }

    setLoading(true);
    setErrore('');

    try {
      // FormData è necessario per mandare file binari
      const formData = new FormData();
      formData.append('foto',      file);        // deve chiamarsi "foto" come nel backend
      formData.append('titolo',    titolo);
      formData.append('categoria', categoria);

      const { data } = await axios.post('/api/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setTitolo('');
      onSuccess(data);   // notifica il componente padre
    } catch (err) {
      setErrore(err.response?.data?.errore || 'Errore nel caricamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      padding: '32px',
      marginBottom: '40px',
    }}>
      <p className="section-label" style={{ marginBottom: '20px' }}>
        Carica una foto
      </p>

      <form onSubmit={handleSubmit}>

        {/* Area drag & drop / click */}
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: `2px dashed ${preview ? 'var(--color-orange)' : 'var(--color-border)'}`,
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'border-color 0.2s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="anteprima"
              style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '4px' }}
            />
          ) : (
            <>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📸</div>
              <p style={{ color: 'var(--color-gray)', fontSize: '14px' }}>
                Clicca per scegliere una foto
              </p>
              <p style={{ color: 'var(--color-gray-dim)', fontSize: '12px', marginTop: '6px' }}>
                JPG, PNG, WEBP — max 5MB
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </div>

        {/* Titolo */}
        <div className="form-group">
          <label>Titolo (opzionale)</label>
          <input
            type="text"
            value={titolo}
            onChange={e => setTitolo(e.target.value)}
            placeholder="es. Raduno Settembre 2024"
          />
        </div>

        {/* Categoria */}
        <div className="form-group">
          <label>Categoria</label>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-white)',
              padding: '14px 16px',
              borderRadius: '4px',
              fontSize: '15px',
            }}
          >
            <option value="misc">Generale</option>
            <option value="moto">Moto</option>
            <option value="raduno">Raduno</option>
            <option value="percorso">Percorso</option>
          </select>
        </div>

        {errore && (
          <p style={{ color: 'var(--color-orange)', fontSize: '13px', marginBottom: '16px' }}>
            {errore}
          </p>
        )}

        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading || !file}
          style={{ width: '100%' }}
        >
          {loading ? 'Caricamento in corso...' : '📤 Carica foto'}
        </button>
      </form>
    </div>
  );
};

export default UploadFoto;