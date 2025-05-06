// src/auth/PrivateRoute.jsx
import { useAuth } from '../context/auth.conext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;