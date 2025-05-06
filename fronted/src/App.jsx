// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.conext';
import PrivateRoute from './components/protectedRoute';
import Login from './pages/login.page';
import Signup from './pages/signup.page';
import Dashboard from './pages/dashboard.page';
// import Home from './pages/Home';
import './App.css'
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;