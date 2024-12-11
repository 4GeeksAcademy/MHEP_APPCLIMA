import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GoogleLogin from './GoogleLogin'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import "../../styles/form.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApjxCBvwLVsW8B6WFLsgJ3AxCoMEM8--I",
  authDomain: "app-de-clima-cd5ef.firebaseapp.com",
  projectId: "app-de-clima-cd5ef",
  storageBucket: "app-de-clima-cd5ef.appspot.com",
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

      console.log("Usuario logueado con Google:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en el inicio de sesión con Google:", error);
      alert("Error al iniciar sesión con Google. Por favor, intenta nuevamente.");
    }
  };

  const responseMessage = (response) => {

    const decodedToken = jwtDecode(response.credential);

    const email = decodedToken.email;
    const name = decodedToken.name;

    const userData = {
      token: response.credential,
      email: email,
      name: name,
    };

    localStorage.setItem('userCredentials', JSON.stringify(userData));

    navigate('/dashboard');
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  // Inicio de sesión con correo y contraseña
  const handelSignIn = () => {
    console.log('Sing In ')
  }
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Usuario logueado con correo:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en el inicio de sesión con correo:", error);
      alert("Usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
    }
  };

  // Redirigir al registro
  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="container">
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
  );
};


export default Login;