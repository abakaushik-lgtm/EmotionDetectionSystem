import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = apiBaseUrl.replace(/\/$/, '');

export { apiBaseUrl };
