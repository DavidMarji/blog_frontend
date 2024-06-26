import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'authentication' : localStorage.getItem('userSession')
  },
});

export default apiClient;