// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.conext';
import PrivateRoute from './components/protectedRoute';
import Login from './pages/login.page';
import Signup from './pages/signup.page';
import Dashboard from './pages/dashboard.page';
import FraudPredictionFrom from './components/FraudPredictionForm';
import LoginForm from './components/Login';
import SignForm from './components/Signup';
// import Home from './pages/Home';
import './App.css'
import SignupForm from './components/Signup';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login1" element={<Login />} />
          <Route path="/signup1" element={<Signup />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<FraudPredictionFrom/>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;