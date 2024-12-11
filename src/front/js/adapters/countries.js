const countryCodes = {
    "AR": "Argentina",
    "BR": "Brasil",
    "CL": "Chile",
    "CO": "Colombia",
    "PE": "Perú",
    "MX": "México",
    "US": "Estados Unidos",
    "ES": "España",
    "FR": "Francia",
    "GB": "Reino Unido",
  };
  
 
  export const getCountryName = (countryCode) => {
    if (!countryCode) {
      console.error("Código de país no definido");
      return "Desconocido";
    }
  
    const countryName = countryCodes[countryCode.toUpperCase()];
    if (!countryName) {
      console.error(`Código de país "${countryCode}" no encontrado`);
      return "Desconocido";
    }
  
    return countryName;
  };
  