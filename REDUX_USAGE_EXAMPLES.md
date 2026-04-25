# Redux Usage Examples in Components

This file shows how to use Redux auth state in your components.

---

## ✅ Access Auth State

```javascript
import { useSelector } from 'react-redux';

function MyComponent() {
  const auth = useSelector((state) => state.auth);
  
  console.log({
    admin: auth.admin,           // { adminId, adminName, email, ... }
    isAuthenticated: auth.isAuthenticated,  // true/false
    isLoading: auth.isLoading,   // true/false
    isError: auth.isError,       // true/false
    errorMessage: auth.errorMessage
  });
  
  return <div>Hello, {auth.admin?.adminName}</div>;
}
```

---

## 🔐 Check Authentication

```javascript
function Dashboard() {
  const { isAuthenticated, admin } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {admin.adminName}</h1>
      <p>Email: {admin.email}</p>
    </div>
  );
}
```

---

## 🚪 Logout in Navbar

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <span>Welcome, {admin?.adminName}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
```

---

## 📋 Display Admin Info

```javascript
import { useSelector } from 'react-redux';

function AdminProfile() {
  const { admin } = useSelector((state) => state.auth);

  return (
    <div className="admin-profile">
      <h2>{admin?.adminName}</h2>
      <p>Email: {admin?.email}</p>
      <p>ID: {admin?.adminId}</p>
      <p>Status: {admin?.isActive ? 'Active' : 'Inactive'}</p>
      <p>Created: {new Date(admin?.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default AdminProfile;
```

---

## 🔄 Conditional Rendering Based on Auth

```javascript
function Header() {
  const { isAuthenticated, admin, isLoading } = useSelector(
    (state) => state.auth
  );

  return (
    <header>
      {isLoading && <div className="spinner">Loading...</div>}
      
      {isAuthenticated ? (
        <div>
          <span>{admin?.adminName}</span>
          {admin?.isActive && <span className="badge-active">ACTIVE</span>}
        </div>
      ) : (
        <div>Not logged in</div>
      )}
    </header>
  );
}

export default Header;
```

---

## 🚨 Show Error Message

```javascript
function LoginStatus() {
  const { isError, errorMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  return (
    <div>
      {isError && (
        <div className="alert alert-error">
          <p>❌ {errorMessage}</p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="alert alert-success">
          <p>✅ Successfully logged in</p>
        </div>
      )}
    </div>
  );
}

export default LoginStatus;
```

---

## 🔐 Protected Component

```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminPanel() {
  const { isAuthenticated, admin } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Only show to admin ID 1
  if (admin?.adminId !== 1) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel Content</div>;
}

export default AdminPanel;
```

---

## 📊 Admin Dashboard

```javascript
import { useSelector } from 'react-redux';

function AdminDashboard() {
  const { admin, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div className="dashboard">
      <div className="admin-card">
        <h3>Admin Information</h3>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{admin.adminName}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{admin.email}</td>
            </tr>
            <tr>
              <td>ID:</td>
              <td>{admin.adminId}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                {admin.isActive ? (
                  <span className="badge-green">Active</span>
                ) : (
                  <span className="badge-red">Inactive</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Joined:</td>
              <td>
                {new Date(admin.createdAt).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
```

---

## 🎯 Login Success Message

```javascript
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function LoginSuccess() {
  const { isAuthenticated, admin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      console.log(`✅ Logged in as ${admin?.adminName}`);
    }
  }, [isAuthenticated, admin]);

  return (
    isAuthenticated && (
      <div className="success-message">
        Welcome back, <strong>{admin?.adminName}</strong>!
      </div>
    )
  );
}

export default LoginSuccess;
```

---

## 📝 Settings Component with Admin Data

```javascript
import { useSelector } from 'react-redux';

function Settings() {
  const { admin } = useSelector((state) => state.auth);

  return (
    <div className="settings">
      <h2>Admin Settings</h2>
      
      <div className="settings-section">
        <h3>Profile Information</h3>
        <input type="text" value={admin?.adminName} readOnly />
        <input type="email" value={admin?.email} readOnly />
      </div>

      <div className="settings-section">
        <h3>Account Status</h3>
        <label>
          <input type="checkbox" checked={admin?.isActive} readOnly />
          Active Account
        </label>
      </div>
    </div>
  );
}

export default Settings;
```

---

## 🔗 Complete Example - Navbar Component

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Admin Panel</h1>
      </div>

      <div className="navbar-center">
        <a href="/">Dashboard</a>
        <a href="/products">Products</a>
        <a href="/orders">Orders</a>
        <a href="/customers">Customers</a>
      </div>

      <div className="navbar-right">
        <div className="admin-info">
          <span className="admin-name">{admin?.adminName}</span>
          <span className="admin-email">{admin?.email}</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="logout-btn"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
```

---

## 🎓 Key Points

✅ Always wrap components with Redux Provider (done in App.jsx)  
✅ Use `useSelector` to read state  
✅ Use `useDispatch` to dispatch actions  
✅ `logout` action clears auth state & localStorage  
✅ `isAuthenticated` check before showing protected content  
✅ Use `admin?.property` for safe access  

---

## 💡 Common Patterns

```javascript
// Check if logged in
const { isAuthenticated } = useSelector(state => state.auth);

// Get admin name
const { admin } = useSelector(state => state.auth);
console.log(admin?.adminName);

// Check if loading
const { isLoading } = useSelector(state => state.auth);
if (isLoading) return <LoadingSpinner />;

// Check if error
const { isError, errorMessage } = useSelector(state => state.auth);
if (isError) return <ErrorMessage msg={errorMessage} />;

// Dispatch logout
const dispatch = useDispatch();
dispatch(logout());
```

---

Ready to integrate Redux in your components! 🚀

