import React from "react";
import { Link } from "react-router-dom";
import Logout from './GoogleLogout';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  function handleSignOut() {
    console.log("User signed out");
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo o título de la aplicación */}
        <Link to="/" className="navbar-brand">
          🌦️ <span className="navbar-title">WeatherPRO</span>
        </Link>

        {/* Botón Cerrar Sesión a la derecha */}
        <div>
          <Logout onSignOut={handleSignOut}>
            <button className="btn-logout">Sign Out</button>
          </Logout>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
