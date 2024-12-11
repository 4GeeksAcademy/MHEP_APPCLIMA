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
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validaciones dinámicas
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "El correo no es válido.",
      }));
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setErrors((prev) => ({
        ...prev,
        password: passwordRegex.test(value)
          ? ""
          : "Debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial.",
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "Las contraseñas no coinciden.",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validaciones finales antes de enviar
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, llena todos los campos antes de continuar.",
      });
      return;
    }

    if (errors.email || errors.password || errors.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Errores de validación",
        text: "Corrige los errores antes de registrarte.",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente.",
      });

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

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>🌦️ Registro de Usuario</h2>

        <div className="input-wrapper">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="input-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-wrapper input-with-icon">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={toggleShowPassword}
            aria-label="Mostrar u ocultar contraseña"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="input-wrapper input-with-icon">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={toggleShowConfirmPassword}
            aria-label="Mostrar u ocultar confirmación de contraseña"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="submit-btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
