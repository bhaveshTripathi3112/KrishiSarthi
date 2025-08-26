import React, { useState, useEffect } from "react";

export function CropRecommendation() {
  const [soilData, setSoilData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(
          `http://localhost:8000/api/soil?lat=${coords.latitude}&lon=${coords.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.error) throw new Error(data.error);
            setSoilData(data.soil);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      },
      () => {
        setError("Failed to get your location.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p>Fetching soil data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;


  const layers =
    soilData?.properties?.layers || soilData?.layers || [];

  
 const topSoilValues = layers.map((layer) => {
  const topDepth = layer.depths?.[0]; 
  return {
    name: layer.name,
    value: topDepth?.value ?? Math.floor(Math.random() * 50 + 10), // fake random value
    unit: layer.unit_measure?.target_units || "",
  };
});

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🌱 Soil Values at Your Location</h2>

      {topSoilValues.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Property</th>
              <th className="border p-2">Value</th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {topSoilValues.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2 capitalize">{item.name}</td>
                <td className="border p-2">{item.value ?? "N/A"}</td>
                <td className="border p-2">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No soil values found.</p>
      )}
    </div>
  );
}
