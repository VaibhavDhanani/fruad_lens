// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Auth.context";
import PrivateLayout from "./components/ProtectedRoute";
import Login from "./pages/Login.page";
import Signup from "./pages/Signup/Signup.page";
import Dashboard from "./pages/Dashboard.page";
import FraudPredictionFrom from "./components/FraudPredictionForm";
import LoginForm from "./components/Login";
import SignupForm from "./components/Signup";
// import Home from './pages/Home';
import AdminDashboard from "./pages/AdminDashBoard";
import Layout from "./components/Layout";
import ProfileCard from "./pages/Profile/ProfileCard";
import FraudDetectionPortal from "./pages/Admin/FruadDetectionPortal";
import ModelRetraining from "./pages/Admin/ModelRetraining";
import HomePage from "./pages/Home";
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
            <Route path="/profile" element={<ProfileCard/>}/>
          </Route>

          {/* Private Layout */}
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<FraudPredictionFrom />} />
          </Route>

          {/* Admin route */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/model" element={<FraudDetectionPortal/>}/>
          <Route path="/admin/model/retrain" element={<ModelRetraining/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
