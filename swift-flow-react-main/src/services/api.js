import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false,
});

// Get CSRF token first
export const getCSRFToken = async () => {
  console.log('🔄 Getting CSRF token...');
  try {
    const response = await API.get('/sanctum/csrf-cookie');
    console.log('✅ CSRF token received');
    return response;
  } catch (error) {
    console.error('❌ CSRF token failed:', error);
    throw error;
  }
};

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData) => {
    console.log('📤 Starting registration process...');
    try {
      await getCSRFToken();
      console.log('📤 Sending registration data:', userData);
      const response = await API.post('/register', userData);
      console.log('✅ Registration successful:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Registration API failed:', error);
      throw error;
    }
  },
  login: async (credentials) => {
    await getCSRFToken();
    return API.post('/login', credentials);
  },
  logout: () => API.post('/logout'),
  getMe: () => API.get('/me'),
};

export default API;