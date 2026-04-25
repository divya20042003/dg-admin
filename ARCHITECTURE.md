# Redux Admin Login Architecture

## 📊 Project Structure

```
dg-admin/
├── src/
│   ├── authApi.js                    ← API Service
│   ├── authSlice.js                  ← Redux State
│   ├── store.js                      ← Redux Store
│   ├── App.jsx                       ← Main App (Redux Provider)
│   ├── components/
│   │   ├── Login.jsx                 ← Login Form (Redux Connected)
│   │   ├── ProtectedRoute.jsx        ← Route Guard
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx             ← Protected
│   │   ├── Products.jsx              ← Protected
│   │   ├── Orders.jsx                ← Protected
│   │   ├── Customers.jsx             ← Protected
│   │   └── Settings.jsx              ← Protected
│   ├── Layout/
│   │   └── AdminLayout.jsx
│   └── ...other files
├── package.json                      ← Updated with Redux packages
└── Documentation files

```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       REDUX STORE                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ auth: {                                                   │  │
│  │   admin: null | {...data},                               │  │
│  │   isAuthenticated: boolean,                              │  │
│  │   isLoading: boolean,                                    │  │
│  │   isError: boolean,                                      │  │
│  │   errorMessage: string                                   │  │
│  │ }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ dispatch(adminLogin())
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN COMPONENT                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • User enters email & password                           │  │
│  │ • Client-side validation                                │  │
│  │ • Dispatch adminLogin() action                          │  │
│  │ • Subscribe to Redux state                              │  │
│  │ • Display loading/error states                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                              │ Call loginApi()
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AUTH API SERVICE                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ axios instance with:                                     │  │
│  │ • Request interceptors (add token)                       │  │
│  │ • Response interceptors (handle 401)                     │  │
│  │ • Base URL: http://localhost:8080                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    POST /admin/login
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                  │
│  http://localhost:8080/admin/login                              │
│                                                                 │
│  Request:  { email, password }                                 │
│  Response: { message, data, statusCode, status }               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      Response Handler
                              ↓
                    ┌──────────┴──────────┐
                    ↓                     ↓
              ✅ SUCCESS              ❌ ERROR
                    ↓                     ↓
        • Store data              • Set error message
        • Save to localStorage    • Show error alert
        • Update Redux state      • Keep on login page
        • Redirect to /           • Clear form
```

---

## 🔐 Route Protection Flow

```
User navigates to /dashboard
        ↓
ProtectedRoute component checks
        ↓
        ├─→ isAuthenticated = true?
        │       ↓
        │   ✅ YES → Render <AdminLayout>
        │
        └─→ isAuthenticated = false?
                ↓
            ❌ NO → Redirect to /login
```

---

## 🔄 Component Interaction

```
┌──────────────┐
│   App.jsx    │ (Redux Provider wrapper)
└──────┬───────┘
       │
       ├─→ <ProtectedRoute>  ← Checks isAuthenticated
       │       │
       │       ├─→ <AdminLayout>
       │       │       │
       │       │       ├─→ <Navbar/>           ← Uses Redux
       │       │       │   (logout button)
       │       │       │
       │       │       ├─→ <Sidebar/>
       │       │       │
       │       │       └─→ <Outlet>
       │       │           (nested routes)
       │       │
       │       ├─→ /dashboard → <Dashboard/>
       │       ├─→ /products  → <Products/>
       │       ├─→ /orders    → <Orders/>
       │       ├─→ /customers → <Customers/>
       │       └─→ /settings  → <Settings/>
       │
       └─→ /login → <Login/>  ← Redux connected
```

---

## 📝 Redux Action Flow

```
User clicks Login button
        ↓
handleLogin() function
        ↓
Validate input
        ↓
dispatch(adminLogin({ email, password }))
        ↓
Redux Thunk interceptor
        ↓
adminLogin.pending → set isLoading: true
        ↓
API Call: loginApi(credentials)
        ↓
Axios POST request
        ↓
        ├─→ Response 200 ✅
        │       ↓
        │   adminLogin.fulfilled
        │       ↓
        │   • Store admin data
        │   • Set isAuthenticated: true
        │   • Save to localStorage
        │
        └─→ Error response ❌
                ↓
            adminLogin.rejected
                ↓
            • Set isError: true
            • Set errorMessage
```

---

## 🔐 Authentication State Tree

```
Redux Store
    │
    └── auth (authSlice)
            │
            ├── admin
            │   ├── adminId: 1
            │   ├── adminName: "Divya"
            │   ├── email: "admin@gmail.com"
            │   ├── password: "admin@123"
            │   ├── isActive: true
            │   ├── lastLogin: null
            │   ├── createdAt: "2026-04-26T00:19:45.78144"
            │   └── updatedAt: "2026-04-26T00:19:45.78144"
            │
            ├── isAuthenticated: boolean
            ├── isLoading: boolean
            ├── isError: boolean
            └── errorMessage: string
```

---

## 🔄 Local Storage Integration

```
Login Success
    ↓
localStorage.setItem('adminToken', JSON.stringify(response.data))
localStorage.setItem('adminData', JSON.stringify(response.data))
    ↓
Page Refresh
    ↓
App checks localStorage
    ↓
    ├─→ Token exists? 
    │       ↓ YES
    │   Keep user logged in
    │
    └─→ Token missing?
            ↓ NO
        Initialize as logged out
```

---

## 🚀 API Request/Response Cycle

```
AXIOS REQUEST
    ↓
Request Interceptor
    ├─→ Add Authorization header
    ├─→ Add Content-Type
    └─→ Add token if exists
    ↓
Send POST /admin/login
    ↓
────────────────────────────────
SERVER SIDE
────────────────────────────────
    ↓
Parse request
    ↓
Validate credentials
    ↓
        ├─→ Valid ✅
        │       ↓
        │   Return 200 with data
        │
        └─→ Invalid ❌
                ↓
            Return 401/error
    ↓
────────────────────────────────
AXIOS RESPONSE
────────────────────────────────
    ↓
Response Interceptor
    ├─→ Check status code
    ├─→ If 401: Clear token & redirect
    └─→ Parse response
    ↓
Return to Redux Thunk
```

---

## 🔒 Security Layers

```
Level 1: Input Validation
    ├─→ Email format check
    ├─→ Password required
    └─→ Trim whitespace

Level 2: API Request
    ├─→ Token attached automatically
    ├─→ HTTPS (in production)
    └─→ CORS handling

Level 3: Response Handling
    ├─→ Check statusCode: 200
    ├─→ Check status: "SUCCESS"
    └─→ Validate response structure

Level 4: Route Protection
    ├─→ Protected routes check isAuthenticated
    ├─→ Redirect to /login if false
    └─→ Check localStorage on app load

Level 5: Token Management
    ├─→ Store in localStorage
    ├─→ Attach to all requests
    └─→ Clear on 401 response
```

---

## 📊 State Change Timeline

```
INITIAL STATE
│
├─ admin: null
├─ isAuthenticated: false
├─ isLoading: false
├─ isError: false
└─ errorMessage: ''
        ↓
    [User submits form]
        ↓
LOADING STATE
│
├─ admin: null
├─ isAuthenticated: false
├─ isLoading: true ✨
├─ isError: false
└─ errorMessage: ''
        ↓
    [API responds]
        ↓
SUCCESS STATE
│
├─ admin: {...data} ✨
├─ isAuthenticated: true ✨
├─ isLoading: false
├─ isError: false
└─ errorMessage: ''
        ↓
    [Redirect to dashboard]


        OR


LOADING STATE
│
├─ admin: null
├─ isAuthenticated: false
├─ isLoading: true
├─ isError: false
└─ errorMessage: ''
        ↓
    [API error]
        ↓
ERROR STATE
│
├─ admin: null
├─ isAuthenticated: false
├─ isLoading: false
├─ isError: true ✨
└─ errorMessage: 'Invalid credentials' ✨
        ↓
    [Show error message]
```

---

## 🎯 Redux DevTools Integration

To debug Redux state, install Redux DevTools browser extension:

```javascript
// authSlice.js will work with Redux DevTools automatically
// Open browser console → Redux tab → See all actions & state changes
```

---

Ready to visualize the architecture! 📊

