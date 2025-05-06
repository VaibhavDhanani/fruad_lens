// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
