import axios from 'axios';
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'authentication' : localStorage.getItem("userSession")
  },
});

export function setAuthHeader() {
  const token = localStorage.getItem("userSession");
  if (token) {
    apiClient.defaults.headers.authentication = token;
  }
}

export default apiClient;