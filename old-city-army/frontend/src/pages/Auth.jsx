import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PageCommon.css';

/* ─── Login ──────────────────────────────────────────────────────────────── */
export const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errore || 'Errore di accesso.');
    } finally { setLoading(false); }
  };

  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="form-card">
        <p className="section-label">Accedi</p>
        <h2>Bentornato</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="tua@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn--primary form-submit" type="submit" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
        <p className="form-link">Non hai un account? <Link to="/diventa-membro">Registrati</Link></p>
      </div>
    </main>
  );
};

/* ─── Register ───────────────────────────────────────────────────────────── */
export const Register = () => {
  const { registra } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ nome: '', cognome: '', email: '', password: '', moto: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await registra(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errore || 'Errore nella registrazione.');
    } finally { setLoading(false); }
  };

  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '100px 24px' }}>
      <div className="form-card">
        <p className="section-label">Unisciti a noi</p>
        <h2>Diventa un Membro</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required placeholder="Mario" />
            </div>
            <div className="form-group">
              <label>Cognome</label>
              <input type="text" name="cognome" value={form.cognome} onChange={handleChange} required placeholder="Rossi" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="mario@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Almeno 6 caratteri" />
          </div>
          <div className="form-group">
            <label>La tua moto (opzionale)</label>
            <input type="text" name="moto" value={form.moto} onChange={handleChange} placeholder="es. Harley Davidson Sportster" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn--primary form-submit" type="submit" disabled={loading}>
            {loading ? 'Registrazione...' : 'Unisciti alla fratellanza'}
          </button>
        </form>
        <p className="form-link">Hai già un account? <Link to="/login">Accedi</Link></p>
      </div>
    </main>
  );
};
