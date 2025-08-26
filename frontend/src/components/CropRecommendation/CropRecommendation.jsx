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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🌱 Soil Properties at Your Location</h2>

      {soilData?.properties?.layers?.map((layer, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50"
        >
          <h3 className="font-semibold text-lg capitalize">
            {layer.name}
          </h3>
          <p className="text-sm text-gray-600">
            Unit: {layer.unit_measure?.target_units || "N/A"}
          </p>

          {layer.depths?.map((depth, dIdx) => (
            <div key={dIdx} className="mt-2 ml-2 p-2 border rounded bg-white">
              <p className="font-medium">{depth.label}</p>
              <p>Value: {depth.value}</p>
              <p>
                Depth: {depth.range.top_depth}–{depth.range.bottom_depth}{" "}
                {depth.range.unit_depth}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
