import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CameraCapture } from '../Camera/Camera';
import { useHeatmap } from '../../contexts/HeatmapContext';

export function Scanner() {
    const { addDiseaseData, recentDiseaseAdded, diseaseData } = useHeatmap();
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [heatmapStatus, setHeatmapStatus] = useState('');

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        if (recentDiseaseAdded) {
            setHeatmapStatus(`✅ ${recentDiseaseAdded.diseaseType} added successfully!`);
            setTimeout(() => setHeatmapStatus(''), 5000);
        }
    }, [recentDiseaseAdded]);

    useEffect(() => {
        if (scanResult && scanResult.confidence >= 0.90 && userLocation) {
            const isDisease = isDiseaseDetected(scanResult.class);
            if (isDisease) {
                handleHeatmapUpdate();
            }
        }
    }, [scanResult, userLocation]);

    const handleHeatmapUpdate = async () => {
        try {
            setHeatmapStatus('📍 Adding to heatmap...');
            await addDiseaseData({
                class: scanResult.class,
                confidence: scanResult.confidence
            }, userLocation);
        } catch (error) {
            console.error('❌ Failed to add disease:', error);
            setHeatmapStatus('❌ Failed to add disease');
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error('Location error:', error)
            );
        }
    };

    const isDiseaseDetected = (className) => {
        if (!className) return false;
        const lowerCase = className.toLowerCase();
        const healthyIndicators = ['healthy', 'normal', 'good', 'fine'];
        if (healthyIndicators.some(indicator => lowerCase.includes(indicator))) {
            return false;
        }
        const diseaseIndicators = [
            'blight', 'spot', 'rot', 'rust', 'mildew', 'wilt', 'scab',
            'disease', 'infection', 'pathogen'
        ];
        return diseaseIndicators.some(indicator => lowerCase.includes(indicator));
    };

    const handleScan = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setScanResult(null);
        setError(null);

        try {
            const apiEndpoint = import.meta.env.VITE_PLANT_API_ENDPOINT;
            if (!apiEndpoint) {
                throw new Error("API endpoint not configured");
            }

            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append('file', blob, 'crop_image.jpg');

            const result = await axios.post(apiEndpoint, formData, {
                timeout: 30000,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setScanResult(result.data);
        } catch (err) {
            setError(`Scan failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Plant Disease Scanner</h1>
            
            <div className="max-w-2xl mx-auto">
                <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
                    <strong>Status:</strong> {diseaseData.length} diseases stored
                    <br />
                    <small>Navigate to <strong>/heatmap</strong> to see map</small>
                </div>

                {userLocation && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                        <strong>📍 Location:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </div>
                )}

                {heatmapStatus && (
                    <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                        {heatmapStatus}
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {selectedImage ? (
                        <img src={selectedImage} alt="Selected plant" className="max-w-full h-auto mx-auto rounded-lg" />
                    ) : (
                        <div className="space-y-4">
                            <div className="text-6xl">🌿</div>
                            <p className="text-gray-600">Upload a photo to scan for diseases</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={() => setShowCamera(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                        Use Camera
                    </button>
                    <label className="px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>

                {selectedImage && (
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
                        <p><strong>Prediction:</strong> {scanResult.class}</p>
                        <p><strong>Confidence:</strong> {(scanResult.confidence * 100).toFixed(1)}%</p>
                    </div>
                )}
            </div>

            {showCamera && (
                <CameraCapture
                    onCapture={setSelectedImage}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}
