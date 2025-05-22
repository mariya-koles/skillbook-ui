import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import Navigation from "./components/Navigation/Navigation";
import { AuthProvider } from "./context/AuthContext";
import InactivityHandler from './components/InactivityHandler/InactivityHandler';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <InactivityHandler>
        <div className="faded-background">
          <Router>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
            </Routes>
          </Router>
        </div>
      </InactivityHandler>
    </AuthProvider>
  );
}

export default App;
