const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY) {
  console.error(
    "La clave API de OpenWeatherMap no está configurada. Asegúrate de agregarla en el archivo .env"
  );
}

// Coordenadas de las capitales de los países (latitud y longitud)
const countryCoordinates = {
  CL: { lat: -33.4489, lon: -70.6693 }, // Santiago, Chile
  US: { lat: 38.9072, lon: -77.0369 }, // Washington, D.C., EE. UU.
  AR: { lat: -34.6037, lon: -58.3816 }, // Buenos Aires, Argentina
  BR: { lat: -15.7801, lon: -47.9292 }, // Brasilia, Brasil
  MX: { lat: 19.4326, lon: -99.1332 }, // Ciudad de México, México
};

const getCoordinatesByCountryCode = (countryCode) => {
  const coordinates = countryCoordinates[countryCode];
  if (coordinates) {
    return coordinates;
  } else {
    throw new Error(`Coordenadas no encontradas para el código de país: ${countryCode}`);
  }
};

export const getWeatherByCountryCode = async (countryCode) => {
  try {
    // Obtén las coordenadas basadas en el código de país
    const { lat, lon } = getCoordinatesByCountryCode(countryCode);

    // Realiza la solicitud a la API de OpenWeatherMap
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del clima: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Datos del clima recibidos:", data);

    // Filtra los datos para mostrar solo un registro por día
    const uniqueDays = new Map();

    const formattedData = data.list
      .filter((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDays.has(date)) {
          uniqueDays.set(date, item);
          return true;
        }
        return false;
      })
      .map((item) => ({
        dt: new Date(item.dt * 1000).toLocaleDateString(),
        temp: (item.main.temp - 273.15).toFixed(1), // Kelvin a Celsius
        description: item.weather[0].description,
        day: new Date(item.dt * 1000).toLocaleDateString("es", { weekday: "long" }),
        isCloudy: item.clouds.all > 0,
        isWindy: item.wind.speed > 5,
      }));

    // Incluye todos los días de la semana
    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    const formattedDataWithDays = daysOfWeek.map((day) => {
      const existingDay = formattedData.find((item) => item.day.toLowerCase() === day);
      return (
        existingDay || {
          day,
          temp: "-",
          description: "Sin datos",
          isCloudy: false,
          isWindy: false,
        }
      );
    });

    return {
      country: data.city.country || countryCode,
      temps: formattedDataWithDays,
    };
  } catch (error) {
    console.error("Error al obtener los datos del clima:", error);
    return { error: "No se pudo obtener los datos del clima. Por favor, verifica tu conexión o la clave API." };
  }
};
