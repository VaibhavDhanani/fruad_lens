// src/auth/PrivateRoute.jsx
import { useAuth } from '../context/auth.conext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;