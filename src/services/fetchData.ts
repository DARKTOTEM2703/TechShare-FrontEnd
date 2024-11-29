    // Función genérica para realizar una solicitud fetch
   const fetchData = async (url:any, token:any) => {
        try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });
  
        if (response.status === 204) {
            return []; // Devuelve un array vacío si no hay contenido.
        }
  
        const data = await response.json(); // Procesa y devuelve los datos en formato JSON.
        return data;
        } catch (error) {
        console.error("Error:", error);
         throw error; // Repropaga el error si necesitas manejarlo más arriba.
    }
  };

  export default fetchData;