import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Swal from "sweetalert2";
import "../../styles/form.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6pmJG26BPnGNAPxdmsnHYn-9zcYINsh8",
  authDomain: "appclima-a1c81.firebaseapp.com",
  projectId: "appclima-a1c81",
  storageBucket: "appclima-a1c81.appspot.com",
  messagingSenderId: "157882657628",
  appId: "1:157882657628:web:3a8df06718e466630eef99",
  measurementId: "G-TRHDBC0V03",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Obtener el token de Firebase
      const token = await user.getIdToken();

      // Crear el payload para enviar al backend
      const payload = {
        uid: user.uid.slice(0, 256), // Truncar a 256 caracteres
        email: user.email.slice(0, 120), // Truncar a 120 caracteres
        emailVerified: user.emailVerified || false,
        password: "default_password", // Contraseña predeterminada
        isActive: true,
        displayName: user.displayName.slice(0, 255), // Truncar a 255 caracteres
        accessToken: token,
      };

      // Enviar datos al backend
      const response = await fetch("https://glorious-zebra-q9q4p6xrrx9cxvp6-3001.app.github.dev/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        // Si la contraseña es predeterminada, redirigir a crear contraseña
        if (data.user.password === "default_password") {
          Swal.fire({
            icon: "info",
            title: "Crea una contraseña",
            text: "Redirigiéndote para configurar tu contraseña personalizada.",
          });
          navigate("/create-password", { state: { token: data.user.accessToken } }); // Pasar el token al estado de la página
        } else {
          Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: `Bienvenido, ${data.user.displayName}`,
          });
          navigate("/dashboard");
        }
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al guardar el usuario",
          text: error.message || "Hubo un problema al guardar el usuario.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: "Error al iniciar sesión con Google. Por favor, intenta nuevamente.",
      });
    }
  };

  // Inicio de sesión con correo y contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: `Bienvenido, ${user.email}`,
      });
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: "Usuario o contraseña incorrectos. Por favor, intenta nuevamente.",
      });
    }
  };

  // Redirigir al registro
  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-8 col-xs-12"></div>
        <div className="fondo">
          <div className="form-container">
            <h2>🌦️ WeatherPRO </h2>
            <h3>Iniciar Sesión</h3>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Iniciar Sesión</button>
            </form>

            <div className="google-login" onClick={handleGoogleLogin}>
              <i className="fab fa-google"></i>
              Login con Google
            </div>

            <button onClick={handleRegisterRedirect} style={{ backgroundColor: "#28a745" }}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
