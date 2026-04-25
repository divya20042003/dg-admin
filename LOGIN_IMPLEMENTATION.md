# Admin Login Implementation with Redux

## Overview
This implementation provides a complete admin login system with Redux state management and API integration.

## Files Created/Modified

### 1. **authApi.js** - API Service Layer
Located at: `src/authApi.js`

```javascript
- Axios instance with base URL configuration
- Request interceptors to add auth tokens
- Response interceptors for error handling
- loginApi() function for authentication
```

**Features:**
- Automatic token attachment to all requests
- Auto-redirect to login on 401 errors
- Error handling and response normalization

---

### 2. **authSlice.js** - Redux Auth Slice
Located at: `src/authSlice.js`

```javascript
- adminLogin: Async thunk for API call
- logout: Action to clear auth state
- Reducers for handling loading/error states
- Auto-persists admin data to localStorage
```

**State Structure:**
```javascript
{
  admin: null | { adminId, adminName, email, ... },
  isLoading: false,
  isError: false,
  errorMessage: '',
  isAuthenticated: boolean
}
```

---

### 3. **store.js** - Redux Store Configuration
Located at: `src/store.js`

Initializes Redux store with auth reducer.

---

### 4. **ProtectedRoute.jsx** - Route Protection
Located at: `src/components/ProtectedRoute.jsx`

```javascript
- Checks if user is authenticated
- Redirects to login if not authenticated
- Wraps protected pages
```

---

### 5. **Login.jsx** - Updated Login Component
Located at: `src/components/Login.jsx`

**Features:**
- Redux integration for state management
- Form validation (email, password)
- Email format validation
- Error message display
- Loading state handling
- Auto-redirect on successful login

---

### 6. **App.jsx** - Updated Main App
Located at: `src/App.jsx`

**Changes:**
- Redux Provider wrapper
- Protected routes for dashboard
- Auto-redirect unmatched routes to login

---

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This installs:
   - `@reduxjs/toolkit` - Redux state management
   - `react-redux` - React bindings for Redux
   - `axios` - HTTP client

2. **Start development server:**
   ```bash
   npm run dev
   ```

---

## How It Works

### Login Flow
```
1. User enters email and password
   ↓
2. Frontend validates input
   ↓
3. Redux action (adminLogin) dispatches API call
   ↓
4. authApi.js sends POST request to http://localhost:8080/admin/login
   ↓
5. Response handled:
   - Success: Store data in Redux + localStorage, redirect to dashboard
   - Error: Display error message
   ↓
6. Protected routes check isAuthenticated
   - If true: Allow access
   - If false: Redirect to login
```

### API Integration
- **Endpoint:** `http://localhost:8080/admin/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin@123"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "Login Success",
    "data": { ... admin data ... },
    "statusCode": 200,
    "status": "SUCCESS"
  }
  ```

---

## Testing Login

**Demo Credentials:**
- Email: `admin@gmail.com`
- Password: `admin@123`

**Test Steps:**
1. Navigate to http://localhost:5173/login
2. Enter demo credentials
3. Click Login
4. Should redirect to dashboard
5. Refresh page - should remain on dashboard (stored in localStorage)
6. Clear localStorage manually - should redirect to login

---

## Security Features

1. **Token Management:**
   - Tokens stored in localStorage
   - Auto-attached to all API requests via interceptors
   - Auto-cleared on 401 responses

2. **Route Protection:**
   - Protected routes check authentication status
   - Unauthenticated users redirected to login
   - Token validation on app load

3. **Input Validation:**
   - Email format validation
   - Required field validation
   - Trimmed input to prevent whitespace issues

---

## Logout Implementation (Optional)

To add logout functionality in Navbar:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { admin } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <span>Welcome, {admin?.adminName}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

---

## Error Handling

Errors handled at multiple levels:

1. **Validation Errors:** Client-side validation
2. **API Errors:** Server response errors
3. **Network Errors:** Connection failures
4. **Auth Errors:** 401 responses trigger redirect to login

All errors displayed in red alert box on login form.

---

## Next Steps (Optional Enhancements)

- [ ] Add JWT token refresh logic
- [ ] Implement remember-me functionality
- [ ] Add role-based access control (RBAC)
- [ ] Implement password reset flow
- [ ] Add two-factor authentication (2FA)
- [ ] Add API response caching

