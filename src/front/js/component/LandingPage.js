import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css"; // Archivo CSS para el Landing Page

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/Login"); 
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>🌤️ Bienvenido a App de Clima</h1>
        <p>Obtén información del clima en tiempo real y planifica tu día con precisión.</p>
        <button className="landing-button" onClick={handleLoginRedirect}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
