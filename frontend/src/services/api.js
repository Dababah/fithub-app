import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  // ✅ Mengambil seluruh objek pengguna dari localStorage
  const user = localStorage.getItem('user');
  
  // ✅ Memeriksa apakah objek pengguna ada dan memiliki token
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

export default api;