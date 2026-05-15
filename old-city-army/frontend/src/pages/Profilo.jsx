import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import './Profilo.css';

/* ─── Avatar placeholder ─────────────────────────────────────────────────── */
const AvatarPlaceholder = ({ nome, cognome, size = 96 }) => {
    const initials = `${nome?.[0] || ''}${cognome?.[0] || ''}`.toUpperCase();
    return (
        <div className="avatar-placeholder" style={{ width: size, height: size, fontSize: size * 0.35 }}>
            {initials}
        </div>
    );
};

/* ─── Stat box ───────────────────────────────────────────────────────────── */
const StatBox = ({ numero, label }) => (
    <div className="profilo__stat">
        <span className="profilo__stat-num">{numero}</span>
        <span className="profilo__stat-label">{label}</span>
    </div>
);

/* ─── Badge ruolo ────────────────────────────────────────────────────────── */
const badgeColori = {
    admin: '#a855f7',
    presidente: '#e8441a',
    veterano: '#f59e0b',
    membro: '#3b82f6',
};
const RuoloBadge = ({ ruolo }) => (
    <span className="ruolo-badge" style={{ borderColor: badgeColori[ruolo], color: badgeColori[ruolo] }}>
        {ruolo}
    </span>
);

/* ─── Tab: Info ──────────────────────────────────────────────────────────── */
const TabInfo = ({ user, onEdit }) => (
    <div className="tab-content">
        <div className="info-grid">
            {[
                ['Nome', user.nome],
                ['Cognome', user.cognome],
                ['Email', user.email],
                ['Moto', user.moto || '—'],
                ['Ruolo', user.ruolo],
                ['Membro dal', new Date(user.dataIscrizione || user.createdAt).toLocaleDateString('it-IT')],
            ].map(([label, valore]) => (
                <div key={label} className="info-field">
                    <span className="info-field__label">{label}</span>
                    <span className="info-field__value">{valore}</span>
                </div>
            ))}
        </div>
        {user.bio && (
            <div className="bio-box">
                <p className="info-field__label">Bio</p>
                <p className="bio-box__text">{user.bio}</p>
            </div>
        )}
        <button className="btn btn--primary" onClick={onEdit} style={{ marginTop: '32px' }}>
            ✏️ Modifica profilo
        </button>
    </div>
);

/* ─── Tab: Modifica ──────────────────────────────────────────────────────── */
const TabModifica = ({ user, onSave, onCancel }) => {
    const [form, setForm] = useState({
        nome: user.nome || '',
        cognome: user.cognome || '',
        moto: user.moto || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
    });
    const [loading, setLoading] = useState(false);
    const [errore, setErrore] = useState('');
    const [ok, setOk] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setErrore(''); setOk(false);
        try {
            const { data } = await axios.put('/api/members/me', form);
            setOk(true);
            setTimeout(() => onSave(data), 800);
        } catch (err) {
            setErrore(err.response?.data?.errore || 'Errore nel salvataggio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content">
            <form onSubmit={handleSubmit}>
                <div className="edit-grid">
                    <div className="form-group">
                        <label>Nome</label>
                        <input name="nome" value={form.nome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Cognome</label>
                        <input name="cognome" value={form.cognome} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>La tua moto</label>
                    <input name="moto" value={form.moto} onChange={handleChange} placeholder="es. Harley Davidson Sportster 883" />
                </div>
                <div className="form-group">
                    <label>URL Avatar (immagine profilo)</label>
                    <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://esempio.com/tua-foto.jpg" />
                    {form.avatar && (
                        <img src={form.avatar} alt="preview" className="avatar-preview" onError={e => e.target.style.display = 'none'} />
                    )}
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Raccontati in poche parole..." maxLength={500} />
                    <span className="char-count">{form.bio.length}/500</span>
                </div>

                {errore && <p className="form-error">{errore}</p>}
                {ok && <p className="form-ok">✅ Profilo aggiornato!</p>}

                <div className="edit-actions">
                    <button type="button" className="btn btn--outline" onClick={onCancel}>Annulla</button>
                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Salvataggio...' : 'Salva modifiche'}
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Tab: I miei Raduni ─────────────────────────────────────────────────── */
const TabRaduni = ({ userId }) => {
    const { data: events, loading } = useApi('/api/events');
    const miei = (events || []).filter(ev =>
        ev.partecipanti?.some(p => (p._id || p) === userId)
    );

    if (loading) return <div className="loading">Caricamento...</div>;

    return (
        <div className="tab-content">
            {miei.length === 0 ? (
                <div className="empty-tab">
                    <span className="empty-tab__icon">🏍️</span>
                    <p>Non sei ancora iscritto a nessun raduno.</p>
                    <a href="/raduni" className="btn btn--primary" style={{ marginTop: '20px' }}>Esplora i Raduni</a>
                </div>
            ) : (
                <div className="miei-raduni">
                    {miei.map(ev => (
                        <div key={ev._id} className="mini-event">
                            <div className="mini-event__date">
                                <span>{new Date(ev.data).getDate()}</span>
                                <span>{new Date(ev.data).toLocaleString('it-IT', { month: 'short' })}</span>
                            </div>
                            <div>
                                <p className="mini-event__title">{ev.titolo}</p>
                                <p className="mini-event__luogo">📍 {ev.luogo}</p>
                            </div>
                            <span className="mini-event__badge">Iscritto</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Tab: La mia Galleria ───────────────────────────────────────────────── */
const TabGalleria = ({ userId }) => {
    const { data: items, loading } = useApi('/api/gallery');
    const miei = (items || []).filter(it => (it.autore?._id || it.autore) === userId);

    if (loading) return <div className="loading">Caricamento...</div>;

    return (
        <div className="tab-content">
            {miei.length === 0 ? (
                <div className="empty-tab">
                    <span className="empty-tab__icon">📸</span>
                    <p>Non hai ancora caricato foto.</p>
                </div>
            ) : (
                <div className="mini-gallery">
                    {miei.map(item => (
                        <div key={item._id} className="mini-gallery__item">
                            <img src={item.url} alt={item.titolo || 'foto'} loading="lazy" />
                            <div className="mini-gallery__overlay">
                                <span>❤️ {item.likes?.length || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Pagina Profilo principale ──────────────────────────────────────────── */
const TABS = [
    { id: 'info', label: '👤 Info' },
    { id: 'raduni', label: '🏍️ Raduni' },
    { id: 'galleria', label: '📸 Galleria' },
];

const Profilo = () => {
    const { user, loading, logout } = useAuth();
    const [tab, setTab] = useState('info');
    const [isEditing, setEditing] = useState(false);
    const [localUser, setLocalUser] = useState(null);

    if (loading) return <div className="loading" style={{ paddingTop: '200px', textAlign: 'center' }}>Caricamento...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const profilo = localUser || user;

    const handleSave = (updated) => {
        setLocalUser(updated);
        setEditing(false);
    };

    return (
        <main className="page profilo-page">
            {/* ── Header profilo ── */}
            <div className="profilo__header">
                <div className="container profilo__header-inner">
                    <div className="profilo__avatar-wrap">
                        {profilo.avatar
                            ? <img src={profilo.avatar} alt="avatar" className="profilo__avatar" />
                            : <AvatarPlaceholder nome={profilo.nome} cognome={profilo.cognome} size={100} />
                        }
                    </div>
                    <div className="profilo__identity">
                        <div className="profilo__name-row">
                            <h1 className="profilo__name">{profilo.nome} {profilo.cognome}</h1>
                            <RuoloBadge ruolo={profilo.ruolo} />
                        </div>
                        {profilo.moto && <p className="profilo__moto">🏍️ {profilo.moto}</p>}
                        {profilo.bio && <p className="profilo__bio">{profilo.bio}</p>}
                    </div>
                    <div className="profilo__stats">
                        <StatBox numero={new Date(profilo.dataIscrizione || profilo.createdAt).getFullYear()} label="Anno iscrizione" />
                        <StatBox numero={profilo.ruolo} label="Ruolo" />
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="profilo__tabs-bar">
                <div className="container profilo__tabs-inner">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`profilo__tab ${tab === t.id && !isEditing ? 'active' : ''}`}
                            onClick={() => { setTab(t.id); setEditing(false); }}
                        >
                            {t.label}
                        </button>
                    ))}
                    <button className="profilo__tab profilo__tab--logout" onClick={logout}>
                        🚪 Esci
                    </button>
                </div>
            </div>

            {/* ── Contenuto tab ── */}
            <div className="container profilo__body">
                {isEditing ? (
                    <TabModifica user={profilo} onSave={handleSave} onCancel={() => setEditing(false)} />
                ) : (
                    <>
                        {tab === 'info' && <TabInfo user={profilo} onEdit={() => setEditing(true)} />}
                        {tab === 'raduni' && <TabRaduni userId={profilo._id} />}
                        {tab === 'galleria' && <TabGalleria userId={profilo._id} />}
                    </>
                )}
            </div>
        </main>
    );
};

export default Profilo;
