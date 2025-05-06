import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Replace with your actual API URL

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;