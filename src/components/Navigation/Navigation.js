import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">Skillbook</div>
        <div>
          <Link className="nav-link" to="/">Home</Link>
          {user ? (
            <>
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
              <Link className="nav-link" to="/courses">Courses</Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
              <Link className="nav-link" to="/courses">Courses</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation; 