import React from "react";
import { Link } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/Auth.context";

const Navbar = () => {
  const { user, logout } = useAuth(); // Use context to get user and logout function

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FruadLens</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User is logged in, show additional options */}
              {/* <span className="text-black">Welcome, {user.username}</span> */}
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button onClick={logout} variant="ghost">
                <LogOut className="h-5 w-5" /> Log Out
              </Button>
            </>
          ) : (
            <>
              {/* User is not logged in, show log in and sign up options */}
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
