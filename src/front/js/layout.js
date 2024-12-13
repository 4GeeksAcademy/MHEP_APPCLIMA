import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import injectContext from "./store/appContext";

import Login from "./component/Login"; // Página principal
import Register from "./component/Register"; // Página de registro
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import WeatherPage from "./pages/weather";
import LandingPage from "./component/LandingPage";
import CreatePassword from "./component/CreatePassword"; // Nuevo componente de creación de contraseña

const Layout = () => {
	const basename = process.env.BASENAME || "";

	return (
		<BrowserRouter basename={basename}>
			<ScrollToTop>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					{/* Ruta principal para el Login */}
					<Route path="/login" element={<Login />} />
					{/* Ruta para el registro */}
					<Route path="/register" element={<Register />} />
					{/* Ruta para crear contraseña */}
					<Route path="/create-password" element={<CreatePassword />} />
					{/* Ruta del Dashboard */}
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/auth/callback" element={<AuthCallback />} />
					<Route path="/clima" element={<WeatherPage />} />
					{/* Ruta por defecto: Not Found */}
					<Route path="*" element={<h1>Not found!</h1>} />
				</Routes>
			</ScrollToTop>
		</BrowserRouter>
	);
};

export default injectContext(Layout);
