import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validaciones
    if (!firstName || !lastName) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: "El nombre y apellido son obligatorios.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Por favor, asegúrate de que ambas contraseñas sean iguales.",
      });
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario con nombre y apellido
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente.",
      });

      // Redirigir al Login después del registro
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: "Hubo un problema al crear tu cuenta. Intenta nuevamente.",
      });
      console.error("Error al registrar usuario:", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>🌦️ Registro de Usuario</h2>

        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={toggleShowPassword}
            aria-label="Mostrar u ocultar contraseña"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={toggleShowConfirmPassword}
            aria-label="Mostrar u ocultar confirmación de contraseña"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
