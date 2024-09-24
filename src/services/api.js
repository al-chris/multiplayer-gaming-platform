// src/services/api.js

import axios from 'axios';

// Base URL of your FastAPI backend
const API_URL = process.env.REACT_APP_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
