import React, { useState, useEffect } from "react";
import axios from "axios";

export function CropRecommendation() {
  const [soilData, setSoilData] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

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

  const getCropRecommendation = async () => {
    if (!soilData) return;
    setRecLoading(true);
    setRecommendation("");
    try {
      const res = await axios.post("http://localhost:8000/api/get-crop-data", {
        soilData,
      });
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecLoading(false);
    }
  };

  if (loading) return <p>Fetching soil data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const layers = soilData?.properties?.layers || [];
  const topSoilValues = layers.map((layer) => {
    const topDepth = layer.depths?.[0];
    let displayValue = "N/A";
    if (topDepth?.values?.mean !== undefined) {
      displayValue = layer.name === "phh2o" ? (topDepth.values.mean / 10).toFixed(1) : topDepth.values.mean;
    }
    return {
      name: layer.name,
      value: displayValue,
      unit: layer.unit_measure?.target_units || "",
    };
  });

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">🌱 Soil Values at Your Location</h2>

      {topSoilValues.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
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
                <td className="border p-2">{item.value}</td>
                <td className="border p-2">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No soil values found.</p>
      )}

      <button
        onClick={getCropRecommendation}
        disabled={recLoading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
      >
        {recLoading ? "Fetching Recommendation..." : "Get Crop Recommendation"}
      </button>

      {recommendation && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold">Recommended Crops:</h3>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}
