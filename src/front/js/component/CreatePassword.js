import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreatePassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Extraer el token desde el estado
    const token = location.state?.token;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.",
            });
            return;
        }

        console.log("Token enviado:", token);

        try {
            const response = await fetch("https://psychic-palm-tree-g4497vv6xwpp2vv5r-3001.app.github.dev/api/create-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ new_password: password }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Contraseña actualizada",
                    text: "Tu contraseña se ha actualizado correctamente.",
                });
                navigate("/dashboard");
            } else {
                const error = await response.json();
                console.error("Error del servidor:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.message || "Hubo un problema al actualizar la contraseña.",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al actualizar la contraseña. Por favor, intenta nuevamente.",
            });
        }
    };


    return (
        <div className="container">
            <div className="form-container">
                <h2>Configura tu Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Nueva Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirma tu Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Actualizar Contraseña</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePassword;
