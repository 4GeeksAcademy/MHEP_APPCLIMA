import React, { useState } from "react";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import "react-datepicker/dist/react-datepicker.css";
import Login from "../component/GoogleLogin";
import EventCreation from "../component/CreateEvent";
import Navbar from "../component/navbar";
import Clima from "../component/Clima";
import Recommendations from "../component/Recommendations";
import "../../styles/dashboard.css";

function App() {
  const [isRecommendationsVisible, setIsRecommendationsVisible] = useState(false); // Estado para controlar recomendaciones
  const session = useSession(); // Tokens: si hay sesión, hay usuario
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <>Cargando...</>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#f4f4f9" }}>
      {session ? (
        <div className="dashboard">
          <Navbar />
          <div className="dashboard-content">
            {/* Componente de Clima */}
            <div className="clima-container">
              <h2 style={{ color: "#333" }}>Pronóstico del Clima</h2>
              <Clima />
            </div>

            {/* Componente de Calendario/Eventos */}
            <div className="calendar-container">
              <h2 style={{ color: "#333" }}>Calendario de Eventos</h2>
              <EventCreation session={session} />
            </div>

            {/* Botón para mostrar recomendaciones */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() =>
                  setIsRecommendationsVisible(!isRecommendationsVisible)
                }
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {isRecommendationsVisible
                  ? "Ocultar Recomendaciones"
                  : "Mostrar Recomendaciones"}
              </button>
            </div>

            {/* Mostrar recomendaciones si es visible */}
            {isRecommendationsVisible && (
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  maxWidth: "600px",
                  margin: "auto",
                }}
              >
                <Recommendations />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#ffffff",
            padding: "50px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            margin: "20px auto",
            maxWidth: "600px",
          }}
        >
          <h2 style={{ color: "#333" }}>Bienvenido a WeatherPRO</h2>
          <p style={{ color: "#555", marginBottom: "20px" }}>
            Para utilizar el calendario de Google y gestionar tus eventos,
            primero necesitamos confirmar tu usuario.
          </p>
          <Login />
        </div>
      )}
    </div>
  );
}

export default App;
