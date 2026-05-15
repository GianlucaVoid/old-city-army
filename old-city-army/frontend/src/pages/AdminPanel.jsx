import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import './PageCommon.css';

const ruoliValidi = ['membro', 'veterano', 'presidente', 'admin'];
const badgeColori = {
    admin: '#a855f7',
    presidente: '#e8441a',
    veterano: '#f59e0b',
    membro: '#3b82f6',
};

const AdminPanel = () => {
    const { user } = useAuth();
    const { data: members, loading, setData } = useApi('/api/members');
    const [feedback, setFeedback] = useState('');

    // Solo admin e presidente possono accedere
    if (!user) return <Navigate to="/login" replace />;
    if (user.ruolo !== 'admin' && user.ruolo !== 'presidente') {
        return <Navigate to="/" replace />;
    }

    const cambiaRuolo = async (memberId, nuovoRuolo) => {
        try {
            const { data } = await axios.patch(
                `/api/members/${memberId}/ruolo`,
                { ruolo: nuovoRuolo }
            );
            setData(prev =>
                prev.map(m => m._id === memberId ? { ...m, ruolo: nuovoRuolo } : m)
            );
            setFeedback(`✅ ${data.membro.nome} aggiornato a "${nuovoRuolo}"`);
            setTimeout(() => setFeedback(''), 3000);
        } catch (err) {
            setFeedback(`❌ ${err.response?.data?.errore || 'Errore'}`);
        }
    };

    return (
        <main className="page">
            <div className="page__hero container">
                <p className="section-label">Gestione</p>
                <h1 className="page__title">Pannello Admin</h1>
                <p className="page__sub">Gestisci i ruoli dei membri della fratellanza.</p>
            </div>

            <div className="container page__content">
                {/* Feedback */}
                {feedback && (
                    <div style={{
                        padding: '14px 20px',
                        marginBottom: '24px',
                        background: feedback.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${feedback.startsWith('✅') ? '#22c55e' : '#ef4444'}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: feedback.startsWith('✅') ? '#22c55e' : '#ef4444',
                    }}>
                        {feedback}
                    </div>
                )}

                {loading && <div className="loading">Caricamento membri...</div>}

                {/* Tabella */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {['Membro', 'Email', 'Moto', 'Ruolo attuale', 'Cambia ruolo'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 16px', textAlign: 'left',
                                        fontSize: '10px', fontWeight: 700,
                                        letterSpacing: '0.18em', textTransform: 'uppercase',
                                        color: 'var(--color-orange)',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(members || []).map(m => (
                                <tr
                                    key={m._id}
                                    style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '16px', fontWeight: 600 }}>
                                        {m.nome} {m.cognome}
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-gray)', fontSize: '14px' }}>
                                        {m.email}
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-gray)', fontSize: '14px' }}>
                                        {m.moto || '—'}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: 700,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            color: badgeColori[m.ruolo],
                                            border: `1px solid ${badgeColori[m.ruolo]}`,
                                            padding: '4px 12px', borderRadius: '100px',
                                        }}>
                                            {m.ruolo}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {m._id === user._id ? (
                                            <span style={{ color: 'var(--color-gray-dim)', fontSize: '13px' }}>(sei tu)</span>
                                        ) : (
                                            <select
                                                value={m.ruolo}
                                                onChange={e => cambiaRuolo(m._id, e.target.value)}
                                                style={{
                                                    background: 'var(--color-surface)',
                                                    border: '1px solid var(--color-border)',
                                                    color: 'var(--color-white)',
                                                    padding: '8px 12px', borderRadius: '4px',
                                                    fontSize: '13px', cursor: 'pointer', outline: 'none',
                                                }}
                                            >
                                                {ruoliValidi.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminPanel;
