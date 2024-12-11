import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Calendar, CloudSun, Clock } from 'lucide-react';
import "../../styles/landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/Login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Content Section */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
          🌦️ WeatherPRO <br></br>
          <br></br>
          Planifica tu dia Inteligentemente
          
          


          </h1>
          <p className="text-xl mb-8 text-white/90">
            Sincroniza tus actividades con el clima. Programa tus eventos de Google Calendar basándote en predicciones meteorológicas precisas.
          </p>
          
          {/* Features Highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <CloudSun className="text-yellow-300" />
              <span>Predicciones Precisas</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-green-300" />
              <span>Integración con Google Calendar</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="text-blue-300" />
              <span>Sugerencias Personalizadas</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sun className="text-orange-300" />
              <span>Planificación Inteligente</span>
            </div>
          </div>

          <div className="flex space-x-4 justify-center lg:justify-start">
            <button 
              onClick={handleLoginRedirect}
              className="bg-white text-sky-600 px-8 py-3 rounded-full font-bold hover:bg-sky-100 transition duration-300 shadow-lg"
            >
              Comenzar Ahora
            </button>
          </div>
        </div>

        {/* Right Image/Mockup Section */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative">
            
              
             <h2>🌦️ WeatherPro App Interface</h2>
             
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-xl px-4 py-3 text-sky-600 text-center">
              <p className="font-bold mb-2">Próxima Actividad</p>
              <div className="flex justify-between items-center">
                <span>Ciclismo</span>
                <span className="text-sm text-gray-500">Soleado, 25°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Weather Elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LandingPage;