# ⚙️ API Configuration & Customization Guide

This guide shows how to configure and customize the API for different environments.

---

## 🔧 Current Configuration

**File:** `src/authApi.js`

Current settings:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

---

## 🌍 Environment-Based Configuration

### Option 1: Environment Variables (Recommended)

**Create `.env` file in project root:**
```
VITE_API_BASE_URL=http://localhost:8080
```

**Create `.env.production`:**
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Update `src/authApi.js`:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Usage in build:**
```bash
npm run dev         # Uses .env (localhost:8080)
npm run build       # Uses .env.production (https://api.yourdomain.com)
```

---

### Option 2: Runtime Configuration

**Create `src/config.js`:**
```javascript
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.yourdomain.com';
  }
  if (window.location.hostname === 'staging.yourdomain.com') {
    return 'https://staging-api.yourdomain.com';
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiUrl();
```

**Use in `src/authApi.js`:**
```javascript
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // ...
});
```

---

### Option 3: Configuration Object

**Create `src/api/config.js`:**
```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    timeout: 10000,
    retryAttempts: 3,
  },
  staging: {
    apiUrl: 'https://staging-api.yourdomain.com',
    timeout: 15000,
    retryAttempts: 5,
  },
  production: {
    apiUrl: 'https://api.yourdomain.com',
    timeout: 20000,
    retryAttempts: 3,
  },
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
```

**Use in `src/authApi.js`:**
```javascript
import apiConfig from './api/config';

const apiClient = axios.create({
  baseURL: apiConfig.apiUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 🔐 Adding Authentication Headers

**Enhanced `src/authApi.js`:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': '1.0.0', // Custom header
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Parse if JSON, otherwise use directly
      const tokenValue = typeof token === 'string' ? JSON.parse(token).token : token;
      config.headers.Authorization = `Bearer ${tokenValue}`;
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Add timestamp
    config.headers['X-Timestamp'] = new Date().toISOString();
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    
    return Promise.reject(error);
  }
);

function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const loginApi = async (credentials) => {
  try {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export default apiClient;
```

---

## 🔄 API with Timeout Configuration

**Enhanced `src/authApi.js`:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const REQUEST_TIMEOUT = 10000; // 10 seconds

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rest of code
```

---

## 🔁 Adding Retry Logic

**Create `src/api/axiosRetry.js`:**
```javascript
import axios from 'axios';
import axiosRetry from 'axios-retry';

export const setupAxiosRetry = (axiosInstance) => {
  axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response?.status >= 500 && error.response?.status < 600)
      );
    },
  });
};
```

**Install axios-retry:**
```bash
npm install axios-retry
```

**Use in `src/authApi.js`:**
```javascript
import { setupAxiosRetry } from './api/axiosRetry';

const apiClient = axios.create({
  // ... config
});

setupAxiosRetry(apiClient);
```

---

## 🌐 CORS Configuration

If your API requires CORS configuration:

**Update `src/authApi.js`:**
```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});
```

---

## 🔐 JWT Token Management

**Enhanced `src/authApi.js`:**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token helper functions
const getToken = () => {
  const token = localStorage.getItem('adminToken');
  return token ? JSON.parse(token) : null;
};

const setToken = (token) => {
  localStorage.setItem('adminToken', JSON.stringify(token));
};

const clearToken = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

const isTokenExpired = (token) => {
  if (!token || !token.expiresAt) return true;
  return new Date().getTime() > new Date(token.expiresAt).getTime();
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginApi = async (credentials) => {
  try {
    const response = await apiClient.post('/admin/login', credentials);
    if (response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export default apiClient;
```

---

## 📊 Different API Endpoints

**Create `src/api/endpoints.js`:**
```javascript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080';

const endpoints = {
  auth: {
    login: `${API_BASE_URL}/admin/login`,
    logout: `${API_BASE_URL}/admin/logout`,
    refresh: `${API_BASE_URL}/admin/refresh-token`,
    profile: `${API_BASE_URL}/admin/profile`,
  },
  users: {
    list: `${API_BASE_URL}/users`,
    get: (id) => `${API_BASE_URL}/users/${id}`,
    create: `${API_BASE_URL}/users`,
    update: (id) => `${API_BASE_URL}/users/${id}`,
    delete: (id) => `${API_BASE_URL}/users/${id}`,
  },
  products: {
    list: `${API_BASE_URL}/products`,
    get: (id) => `${API_BASE_URL}/products/${id}`,
  },
  orders: {
    list: `${API_BASE_URL}/orders`,
    get: (id) => `${API_BASE_URL}/orders/${id}`,
  },
};

export default endpoints;
```

**Use in authApi.js:**
```javascript
import endpoints from './endpoints';

export const loginApi = async (credentials) => {
  try {
    const response = await apiClient.post(endpoints.auth.login, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
```

---

## 🧪 API Mock for Testing

**Create `src/api/mockApi.js`:**
```javascript
export const mockLoginResponse = {
  message: 'Login Success',
  data: {
    adminId: 1,
    adminName: 'Divya',
    email: 'admin@gmail.com',
    password: 'admin@123',
    isActive: true,
    lastLogin: null,
    createdAt: '2026-04-26T00:19:45.78144',
    updatedAt: '2026-04-26T00:19:45.78144',
  },
  statusCode: 200,
  status: 'SUCCESS',
};

export const mockLoginError = {
  message: 'Invalid credentials',
  statusCode: 401,
  status: 'FAILED',
};

// Use in development
export const mockLoginApi = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === 'admin@gmail.com' &&
        credentials.password === 'admin@123'
      ) {
        resolve(mockLoginResponse);
      } else {
        reject(mockLoginError);
      }
    }, 1000);
  });
};
```

**Use in authSlice.js (for testing):**
```javascript
import { loginApi } from '../authApi';
// import { mockLoginApi as loginApi } from '../api/mockApi'; // For testing

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      // ... rest of code
    } catch (error) {
      // ... error handling
    }
  }
);
```

---

## 🔍 API Debugging

**Create `src/api/debug.js`:**
```javascript
export const enableApiDebug = (apiClient) => {
  // Log all requests
  apiClient.interceptors.request.use((config) => {
    console.log('🚀 API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  });

  // Log all responses
  apiClient.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
};
```

**Use in development:**
```javascript
// src/authApi.js
import { enableApiDebug } from './api/debug';

if (process.env.NODE_ENV === 'development') {
  enableApiDebug(apiClient);
}
```

---

## 📝 Complete Enhanced Example

**Full `src/authApi.js` with all features:**
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const REQUEST_TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const tokenData = JSON.parse(token);
        config.headers.Authorization = `Bearer ${tokenData.token || token}`;
      } catch {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Timestamp'] = new Date().toISOString();

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }

    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export const loginApi = async (credentials) => {
  try {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export default apiClient;
```

---

## ✅ Configuration Checklist

- [ ] Choose configuration method (env variables recommended)
- [ ] Set API_BASE_URL for your environment
- [ ] Add authentication headers if needed
- [ ] Configure timeout settings
- [ ] Set up retry logic if needed
- [ ] Enable CORS if needed
- [ ] Add debugging in development
- [ ] Test with your backend API
- [ ] Verify token management
- [ ] Test in all environments

---

Ready to configure! 🚀

