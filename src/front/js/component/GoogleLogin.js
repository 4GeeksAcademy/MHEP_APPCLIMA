import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Estilos para el botón de Google
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#4285F4',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '12px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '320px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
};

const googleLogoStyle = {
  width: '24px',
  height: '24px',
  marginRight: '12px',
};

const Login = ({ onSignIn }) => {
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function googleSignIn() {
    setIsLoading(true); // Inicia el indicador de carga
    setErrorMessage(''); // Limpiar el mensaje de error anterior
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: 'https://glorious-zebra-q9q4p6xrrx9cxvp6-3000.app.github.dev/auth/callback',
        },
      });

      if (error) {
        throw new Error("Error al iniciar sesión con Google: " + error.message);
      }

      // Llamar a la función de éxito proporcionada como prop
      onSignIn();
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error inesperado durante el inicio de sesión.");
      console.error(error);
    } finally {
      setIsLoading(false); // Detener el indicador de carga
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <button style={buttonStyle} onClick={googleSignIn} disabled={isLoading}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          alt="Google logo"
          style={googleLogoStyle}
        />
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
      </button>
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;