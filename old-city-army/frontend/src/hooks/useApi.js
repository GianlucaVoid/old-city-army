import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (url) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    axios.get(url)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.errore || 'Errore di rete'))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error, setData };
};