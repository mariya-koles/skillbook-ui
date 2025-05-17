import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/greeting")
      .then(res => setMessage(res.data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div className="home-container">
      <div className="home-overlay">
        <div className="home-hero">
          <h1 className="home-heading">
            Welcome to <span className="home-brand">Skillbook</span>!
          </h1>
          <p className="home-subtext">
            Register as a learner to access instructor-led courses across a variety of topics.
          </p>
          <p className="home-subtext">
            Join a growing community and start learning something new today.
          </p>
          <button className="home-button" onClick={() => navigate("/register")}>
            Get Started
          </button>
          {message && <p className="home-backend-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
