// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import PrivateLayout from './components/protectedRoute';
import Login from './pages/login.page';
import Signup from './pages/signup.page';
import Dashboard from './pages/dashboard.page';
import FraudPredictionFrom from './components/FraudPredictionForm';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
// import Home from './pages/Home';
import HomePage from './pages/home.page';
import AdminDashboard from './pages/AdminDashBoard';
import Layout from './components/layout';
function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        {/* Public Layout */}
          <Route path="/login1" element={<LoginForm />} />
          <Route path="/signup1" element={<SignupForm />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Private Layout */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict" element={<FraudPredictionFrom />} />
        </Route>

        {/* Admin route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;