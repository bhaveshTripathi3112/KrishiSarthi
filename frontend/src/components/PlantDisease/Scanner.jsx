import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CameraCapture } from '../Camera/Camera';
import { useHeatmap } from '../../contexts/HeatmapContext';

export function Scanner() {
    const { addDiseaseData, diseaseData } = useHeatmap();

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [heatmapStatus, setHeatmapStatus] = useState('');
    const [geminiResponse, setGeminiResponse] = useState(null);

    const mlEndpoint = "https://plant-disease-prediction-krishisharthi.onrender.com/predict/";

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    console.log("📍 User location detected:", loc);
                    setUserLocation(loc);
                },
                (error) => console.error('❌ Location error:', error)
            );
        }
    };

    // ✅ Simplified: Ignore only "healthy"
    const isDiseaseDetected = (className) => {
        if (!className) return false;
        const lowerCase = className.toLowerCase();
        const result = !lowerCase.includes("healthy");
        console.log(`🔍 isDiseaseDetected("${className}") => ${result}`);
        return result;
    };

    const handleHeatmapUpdate = async (diseaseClass, confidence) => {
        if (!diseaseClass || !userLocation) {
            console.log("⚠️ Skipping heatmap update - missing diseaseClass or location");
            return;
        }
        try {
            console.log("🗺️ Adding to heatmap:", diseaseClass, "Conf:", confidence, "Loc:", userLocation);
            setHeatmapStatus('Adding to heatmap...');
            await addDiseaseData({ class: diseaseClass, confidence }, userLocation);
            setHeatmapStatus(` ${diseaseClass} added successfully!`);
            console.log("✅ Heatmap updated with:", diseaseClass);
            setTimeout(() => setHeatmapStatus(''), 5000);
        } catch (err) {
            console.error('❌ Failed to add disease:', err);
            setHeatmapStatus(' Failed to add disease');
        }
    };

    const fetchGeminiResponse = async (diseaseName) => {
        try {
            if (!diseaseName) return;
            setGeminiResponse(' Fetching disease info...');
            console.log("🤖 Fetching Gemini info for:", diseaseName);
            const res = await axios.post("http://localhost:8000/api/gemini", {
                diseaseName,
            });
            setGeminiResponse(res.data.text);
            console.log("✅ Gemini response received:", res.data.text);
        } catch (err) {
            console.error("❌ Gemini API error:", err);
            setGeminiResponse(
                `Failed to fetch info: ${
                    err.response?.data?.error || err.message
                }`
            );
        }
    };

    const handleScan = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setScanResult(null);
        setError(null);
        setGeminiResponse(null);

        try {
            // 1️⃣ Send image to ML model
            const formData = new FormData();
            formData.append('file', selectedFile);

            console.log("📤 Sending image to ML endpoint:", mlEndpoint);
            const result = await axios.post(mlEndpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("📥 Raw ML response:", result.data);

            const rawName = result.data.class;
            const confidence = result.data.confidence;
            const diseaseName =
                rawName.split('___')[1]?.replace(/_/g, ' ') || rawName;

            console.log("🔎 Processed prediction:", diseaseName, "Confidence:", confidence);

            // Update state
            setScanResult({ class: diseaseName, confidence });

            // 2️⃣ Directly update heatmap if disease detected
            if (confidence >= 0.9 && isDiseaseDetected(diseaseName) && userLocation) {
                await handleHeatmapUpdate(diseaseName, confidence);
            } else {
                console.log("⚠️ Skipping heatmap update - confidence too low OR marked healthy OR no location");
            }

            // 3️⃣ Fetch disease info
            fetchGeminiResponse(diseaseName);
        } catch (err) {
            console.error("❌ Scan failed:", err);
            setError(`Scan failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
            console.log("📂 File uploaded:", file.name);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Plant Disease Scanner
            </h1>
            <div className="max-w-2xl mx-auto">
                <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
                    <strong>Status:</strong> {diseaseData.length} diseases stored
                    <br />
                    <small>
                        Navigate to <strong>/heatmap</strong> to see map
                    </small>
                </div>

                {userLocation && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                        <strong> Location:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </div>
                )}

                {heatmapStatus && (
                    <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                        {heatmapStatus}
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Selected plant"
                            className="max-w-full h-auto mx-auto rounded-lg"
                        />
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Upload a photo to scan for diseases
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                    >
                        Use Camera
                    </button>
                    <label className="px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {selectedFile && (
                    <button
                        onClick={handleScan}
                        disabled={loading}
                        className="w-full mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Analyzing...' : 'Scan for Diseases'}
                    </button>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {scanResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold">Results:</h3>
                        <p>
                            <strong>Prediction:</strong> {scanResult.class}
                        </p>
                        <p>
                            <strong>Confidence:</strong>{' '}
                            {(scanResult.confidence * 100).toFixed(1)}%
                        </p>
                    </div>
                )}

                {geminiResponse && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold">
                            Disease Info & Prevention:
                        </h3>
                        <p>{geminiResponse}</p>
                    </div>
                )}
            </div>

            {showCamera && (
                <CameraCapture
                    onCapture={(img, file) => {
                        setSelectedImage(img);
                        setSelectedFile(file);
                        console.log("📸 Captured from camera");
                    }}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}
