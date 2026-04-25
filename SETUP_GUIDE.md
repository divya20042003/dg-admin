# ⚡ Redux Admin Login - Quick Setup Guide

## ✅ What's Implemented

Your admin login system now includes:

✓ **Redux State Management** - Centralized auth state  
✓ **API Integration** - Axios with interceptors  
✓ **Protected Routes** - Redirect unauthenticated users  
✓ **Form Validation** - Email & password checks  
✓ **Error Handling** - User-friendly error messages  
✓ **Auto Redirect** - Redirect to dashboard on login  
✓ **Token Persistence** - localStorage integration  

---

## 📦 Installation Commands

```bash
# Install all dependencies
npm install

# Start development server
npm run dev
```

---

## 📁 File Structure

```
src/
├── authApi.js          ← API calls & axios config
├── authSlice.js        ← Redux state management
├── store.js            ← Redux store setup
├── App.jsx             ← Updated with Redux Provider
├── components/
│   ├── Login.jsx       ← Updated login form
│   └── ProtectedRoute.jsx  ← Route protection
└── pages/
    └── ... (dashboard, products, etc)
```

---

## 🔐 Login with Demo Credentials

**Email:** `admin@gmail.com`  
**Password:** `admin@123`

---

## 📊 Redux State

```javascript
auth: {
  admin: { adminId, adminName, email, ... },
  isAuthenticated: true/false,
  isLoading: true/false,
  isError: true/false,
  errorMessage: ''
}
```

---

## 🔄 API Flow

```
Login Form 
  ↓
Validation
  ↓
Redux: adminLogin()
  ↓
authApi.js: loginApi()
  ↓
POST /admin/login
  ↓
Success: Store + Redirect
Error: Show Message
```

---

## 💡 Usage in Components

**Access Auth State:**
```javascript
import { useSelector } from 'react-redux';

const { admin, isAuthenticated } = useSelector(state => state.auth);
```

**Logout:**
```javascript
import { useDispatch } from 'react-redux';
import { logout } from '../authSlice';

const dispatch = useDispatch();
dispatch(logout());
```

---

## ✨ Features

| Feature | Implementation |
|---------|-----------------|
| Login API | ✓ Integrated |
| Form Validation | ✓ Email & Password |
| Error Messages | ✓ User-friendly |
| Protected Routes | ✓ Auto-redirect |
| Token Storage | ✓ localStorage |
| Auto Logout (401) | ✓ Implemented |
| Loading State | ✓ Disabled buttons |

---

## 🚀 Test the Implementation

1. Clear browser storage:
   ```javascript
   localStorage.clear()
   ```

2. Go to login page: `http://localhost:5173/login`

3. Try with demo credentials above

4. Should redirect to dashboard

5. Refresh page - should stay on dashboard

6. Manual localStorage clear - redirects to login

---

## 📝 Additional Notes

- **API Base URL:** `http://localhost:8080`
- **Token stored as:** JSON object in localStorage
- **Interceptors:** Auto-attach token & handle 401 errors
- **Validation:** Client-side + server-side (API)

---

Ready to go! 🎉
