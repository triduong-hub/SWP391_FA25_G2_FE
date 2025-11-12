import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added:', token.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage!');
      console.warn('   localStorage keys:', Object.keys(localStorage));
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, '→', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url);
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('❌ Unauthorized - Token có thể hết hạn hoặc không hợp lệ');
      
      // Chỉ clear và redirect nếu không phải public API
      if (!error.config?.url?.includes('/login') && 
          !error.config?.url?.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?error=session_expired';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;