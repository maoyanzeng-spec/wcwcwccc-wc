import axios from 'axios';
import { getSession, clearSession } from './storage';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// On 401, clear stale session and send user back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearSession();
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
