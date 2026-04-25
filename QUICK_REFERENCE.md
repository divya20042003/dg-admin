# 🚀 Redux Admin Login - Quick Reference Card

## 📦 Installation
```bash
npm install
npm run dev
```

---

## 🔑 Demo Credentials
```
Email:    admin@gmail.com
Password: admin@123
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `authApi.js` | API calls & axios config |
| `authSlice.js` | Redux state management |
| `store.js` | Redux store setup |
| `components/Login.jsx` | Login form |
| `components/ProtectedRoute.jsx` | Route protection |
| `App.jsx` | Main app with Redux |

---

## 🔄 Redux State

```javascript
state.auth = {
  admin: { adminId, adminName, email, ... },
  isAuthenticated: boolean,
  isLoading: boolean,
  isError: boolean,
  errorMessage: string
}
```

---

## 🎯 Use in Components

### Check if Logged In
```javascript
const { isAuthenticated } = useSelector(state => state.auth);
if (isAuthenticated) { ... }
```

### Get Admin Data
```javascript
const { admin } = useSelector(state => state.auth);
console.log(admin?.adminName);
```

### Logout
```javascript
const dispatch = useDispatch();
dispatch(logout());
```

---

## 🔒 Protected Routes
```
/login → Public
/       → Protected (auth required)
/products → Protected
/orders → Protected
/customers → Protected
/settings → Protected
```

---

## 🔗 API Endpoint
```
POST http://localhost:8080/admin/login
```

### Request
```json
{
  "email": "admin@gmail.com",
  "password": "admin@123"
}
```

### Response
```json
{
  "message": "Login Success",
  "data": { /* admin data */ },
  "statusCode": 200,
  "status": "SUCCESS"
}
```

---

## 💾 localStorage Keys
```
adminToken → Stores admin data as JSON
adminData  → Backup copy
```

---

## ✨ Features

✅ Redux state management  
✅ API integration with axios  
✅ Protected routes  
✅ Form validation  
✅ Error handling  
✅ Loading states  
✅ localStorage persistence  
✅ Token management  

---

## 🧪 Test Login

1. Go to http://localhost:5173/login
2. Enter demo credentials above
3. Click Login
4. Should redirect to dashboard
5. Refresh - should stay logged in
6. Clear localStorage - should redirect to login

---

## 🛠️ Common Tasks

### Login with Redux
```javascript
const handleLogin = () => {
  dispatch(adminLogin({ email, password }));
};
```

### Display Admin Name
```javascript
const { admin } = useSelector(state => state.auth);
<span>{admin?.adminName}</span>
```

### Add Logout Button
```javascript
<button onClick={() => dispatch(logout())}>
  Logout
</button>
```

### Check Loading State
```javascript
const { isLoading } = useSelector(state => state.auth);
<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Login'}
</button>
```

### Check Error
```javascript
const { isError, errorMessage } = useSelector(state => state.auth);
{isError && <div className="error">{errorMessage}</div>}
```

---

## 🐛 Debugging

### Check Redux State
```javascript
// In browser console
store.getState()
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('adminToken')
localStorage.getItem('adminData')
```

### Monitor API Calls
```
DevTools → Network → XHR
Look for POST /admin/login
```

### Redux DevTools
```
Install Redux DevTools browser extension
DevTools → Redux tab → See all actions
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Blank localStorage | Clear cache, re-login |
| Always redirects to login | Check API base URL |
| Token not sent | Check axios interceptors |
| 404 errors | Check API endpoint |
| State not updating | Refresh Redux DevTools |

---

## 📚 Documentation

- `LOGIN_IMPLEMENTATION.md` → Detailed guide
- `SETUP_GUIDE.md` → Quick start
- `REDUX_USAGE_EXAMPLES.md` → Code examples
- `ARCHITECTURE.md` → System design
- `TESTING_CHECKLIST.md` → Test cases

---

## 🚨 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | User logged in |
| 401 | Unauthorized | Invalid credentials |
| 400 | Bad Request | Check input format |
| 500 | Server Error | API issue |

---

## 🔐 Security Checklist

✅ Input validation  
✅ Token storage  
✅ HTTPS (production)  
✅ Protected routes  
✅ Error handling  
✅ Auto logout (401)  
✅ Token interceptors  
✅ localStorage cleanup  

---

## 📞 API Base URL

Update in `authApi.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

For production:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com';
```

---

## 🎓 Redux Concepts Used

- **Thunks** → Handle async operations
- **Slices** → Combine reducer + actions
- **Selectors** → Read state from components
- **Dispatch** → Trigger actions
- **Subscribe** → Listen for state changes

---

## 💡 Pro Tips

1. Use Redux DevTools for debugging
2. Check localStorage for token issues
3. Monitor Network tab for API calls
4. Use `admin?.property` for safe access
5. Always check `isLoading` before submitting
6. Clear localStorage on logout
7. Validate input on client side first

---

## 🔗 Resources

- Redux Toolkit Docs: https://redux-toolkit.js.org
- React-Redux Hooks: https://react-redux.js.org/api/hooks
- Axios Documentation: https://axios-http.com

---

## ✅ Quick Start

```bash
# 1. Install
npm install

# 2. Start dev server
npm run dev

# 3. Go to login page
# http://localhost:5173/login

# 4. Use demo credentials
# admin@gmail.com / admin@123

# 5. Redirects to dashboard ✨
```

---

**Ready to use! 🚀**

