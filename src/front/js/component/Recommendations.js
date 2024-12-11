import React, { useState } from "react";
import Swal from "sweetalert2";

const Recommendations = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    if (!query.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, escribe un tema para obtener recomendaciones.",
      });
      return;
    }

    setLoading(true);
    setRecommendations("");

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `Proporciona recomendaciones sobre el siguiente tema: ${query}`,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con la API de OpenAI.");
      }

      const data = await response.json();
      setRecommendations(data.choices[0].text.trim());

      Swal.fire({
        icon: "success",
        title: "Recomendaciones obtenidas",
        text: "Las recomendaciones se generaron exitosamente.",
      });
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al obtener recomendaciones. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe un tema..."
        rows="4"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      <br />
      <button
        onClick={fetchRecommendations}
        disabled={loading}
        style={{
          marginTop: "10px",
          backgroundColor: "#4caf50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Cargando..." : "Obtener Recomendaciones"}
      </button>
      <div
        style={{
          marginTop: "20px",
          textAlign: "left",
          whiteSpace: "pre-wrap",
          backgroundColor: "#f9f9f9",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        {recommendations}
      </div>
    </div>
  );
};

export default Recommendations;
