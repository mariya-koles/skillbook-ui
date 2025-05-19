import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
    // Clear the auth context
    logout();
    // Redirect to home page
    navigate('/');
  };

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
              <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
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