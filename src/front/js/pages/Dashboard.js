import React, { useState } from "react";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import "react-datepicker/dist/react-datepicker.css";
import Login from "../component/GoogleLogin";
import EventCreation from "../component/CreateEvent";
import Navbar from "../component/navbar";
import Clima from "../component/Clima";
import "../../styles/dashboard.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession(); // tokens, when session exists we have a user
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <>Loading....</>;
  }

  function handleSignIn() {
    setIsLoggedIn(true);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {session ? (
        <div className="dashboard">
        <Navbar />
        <div className="dashboard-content">
          {/* Componente de Clima */}
          <div className="clima-container">
            <h2>Pronóstico del Clima</h2>
            <Clima />
          </div>
      
          {/* Componente de Calendario/Eventos */}
          <div className="calendar-container">
            <h2>Calendario de Eventos</h2>
            <EventCreation session={session} />
          </div>
        </div>
      </div>
      
      ) : (
        <>
          <p>Necesitas iniciar sesión con Google para acceder</p>
          <Login onSignIn={handleSignIn} />
        </>
      )}
    </div>
  );
}

export default App;
