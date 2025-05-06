// components/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Navbar from "./navbar";

const PrivateLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <main><Outlet /></main>
    </>
  );
};

export default PrivateLayout;
