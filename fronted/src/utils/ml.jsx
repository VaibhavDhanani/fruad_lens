import axios from 'axios';

const API_URL = 'http://13.127.98.0:8000/model1'; // Replace with your actual API URL

// Create an axios instance with base URL
const ml = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ml;