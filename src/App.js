import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

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

function App() {
  return (
    <AuthProvider>
      <div className="faded-background">
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
