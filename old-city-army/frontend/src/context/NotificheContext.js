import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificheContext = createContext(null);

export const NotificheProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifiche,  setNotifiche]  = useState([]);
  const [nonLette,   setNonLette]   = useState(0);
  const [loading,    setLoading]    = useState(false);

  const fetchNotifiche = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/notifiche');
      setNotifiche(data.notifiche);
      setNonLette(data.nonLette);
    } catch {
      // silenzioso
    }
  }, [user]);

  // Carica subito al login e poi ogni 30 secondi (polling)
  useEffect(() => {
    if (!user) { setNotifiche([]); setNonLette(0); return; }
    fetchNotifiche();
    const interval = setInterval(fetchNotifiche, 30000);
    return () => clearInterval(interval);
  }, [user, fetchNotifiche]);

  const segnaLetta = async (id) => {
    try {
      await axios.patch(`/api/notifiche/${id}/leggi`);
      setNotifiche(prev => prev.map(n => n._id === id ? { ...n, letta: true } : n));
      setNonLette(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const segnaLetteTutte = async () => {
    try {
      await axios.patch('/api/notifiche/leggi-tutte');
      setNotifiche(prev => prev.map(n => ({ ...n, letta: true })));
      setNonLette(0);
    } catch {}
  };

  const eliminaNotifica = async (id) => {
    try {
      const era = notifiche.find(n => n._id === id);
      await axios.delete(`/api/notifiche/${id}`);
      setNotifiche(prev => prev.filter(n => n._id !== id));
      if (era && !era.letta) setNonLette(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const eliminaTutte = async () => {
    try {
      await axios.delete('/api/notifiche');
      setNotifiche([]);
      setNonLette(0);
    } catch {}
  };

  return (
    <NotificheContext.Provider value={{
      notifiche, nonLette, loading,
      fetchNotifiche, segnaLetta, segnaLetteTutte,
      eliminaNotifica, eliminaTutte,
    }}>
      {children}
    </NotificheContext.Provider>
  );
};

export const useNotifiche = () => useContext(NotificheContext);
