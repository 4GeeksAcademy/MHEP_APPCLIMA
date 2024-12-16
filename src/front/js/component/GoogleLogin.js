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

  async function googleSignIn() {
    setIsLoading(true); // Inicia el indicador de carga
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: 'https://glorious-zebra-q9q4p6xrrx9cxvp6-3000.app.github.dev/auth/callback',
          redirectTo: 'https://musical-disco-jjj6qpp9rwx6hq57p-3000.app.github.dev/auth/callback',
        },
      });

      if (error) {
        throw new Error("Error al iniciar sesión con Google: " + error.message);
      }

      // Llamar a la función de éxito proporcionada como prop
      onSignIn();
    } catch (error) {
      alert(error.message || "Ocurrió un error inesperado durante el inicio de sesión.");
      console.error(error);
    } finally {
      setIsLoading(false); // Detener el indicador de carga
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <button style={buttonStyle} onClick={googleSignIn} disabled={isLoading}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          alt="Google logo"
          style={googleLogoStyle}
        />
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
      </button>
    </div>
  );
};

export default Login;
