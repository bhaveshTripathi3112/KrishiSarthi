import React, { useState, useEffect } from 'react';

// A simple loading spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
    </div>
);

export function CropRecommendation() {
    const [location, setLocation] = useState(null);
    const [cropData, setCropData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // This function calls your backend API
    const fetchCropData = async (coords) => {
        try {
            // IMPORTANT: Replace with your actual deployed backend URL
            // For local development, it might be 'http://127.0.0.1:5000/api/get-crop-data'
            const response = await fetch('/api/get-crop-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coords),
            });

            if (!response.ok) {
                // Get a more descriptive error from the backend if possible
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get crop data from the server.');
            }

            const data = await response.json();
            // Assuming your backend returns { "suitable_crops": ["Wheat", "Mustard"] }
            setCropData(data.suitable_crops);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Check if geolocation is available
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        // 2. Get the user's current position
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                // 3. Call the backend with the location
                fetchCropData({ latitude, longitude });
            },
            // Error callback
            () => {
                setError('Unable to retrieve your location. Please enable location services in your browser settings and refresh the page.');
                setLoading(false);
            }
        );
    }, []); // The empty array ensures this effect runs only once on component mount

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-semibold mb-4">Analyzing Your Land... 🛰️</h2>
                <p className="text-gray-600 mb-6">Fetching your location and getting recommendations.</p>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-lg max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-red-700 mb-4">An Error Occurred</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Crop Recommendations for Your Area 🌾</h1>
            {cropData && cropData.length > 0 ? (
                <div className="bg-green-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-green-800">Based on your location and land data, here are the most suitable crops:</h2>
                    <ul className="list-disc list-inside space-y-3">
                        {cropData.map((crop, index) => (
                            <li key={index} className="text-lg text-gray-700">{crop}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center p-10 bg-yellow-50 rounded-lg">
                     <h2 className="text-2xl font-semibold text-yellow-800 mb-4">No Recommendations Found</h2>
                    <p className="text-yellow-700">We couldn't find specific crop recommendations for your exact location at this time.</p>
                </div>
            )}
        </div>
    );
}