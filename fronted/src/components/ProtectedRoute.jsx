import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.context";
import Navbar from "./Navbar";

const PrivateLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PrivateLayout;
