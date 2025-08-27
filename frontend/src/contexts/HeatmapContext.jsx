import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const HeatmapContext = createContext();

export const HeatmapProvider = ({ children }) => {
  const [addDiseaseFunction, setAddDiseaseFunction] = useState(null);
  const [isHeatmapReady, setIsHeatmapReady] = useState(false);
  const [diseaseData, setDiseaseData] = useState([]);
  const [recentDiseaseAdded, setRecentDiseaseAdded] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  
  useEffect(() => {
    loadDiseasesFromDatabase();
    
    const interval = setInterval(() => {
      loadDiseasesFromDatabase();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadDiseasesFromDatabase = async () => {
    try {
      console.log('📊 Loading from MongoDB...');
      const response = await axios.get(`${API_BASE_URL}/api/locations`);
      
      const diseases = response.data
        .filter(item => item.isDiseaseReport || item.diseaseType)
        .map(item => ({
          id: item._id,
          diseaseType: item.diseaseType || 'Disease',
          lat: item.location?.coordinates?.[1] || 0,
          lng: item.location?.coordinates?.[0] || 0,
          confidence: item.confidence || 0.9,
          timestamp: item.createdAt || item.timestamp,
          reportCount: item.reportCount || 1,
          userId: item.userId || 'anonymous'
        }))
        .filter(d => d.lat !== 0 && d.lng !== 0);

      console.log('✅ Loaded diseases from database:', diseases.length);
      setDiseaseData(diseases);
    } catch (error) {
      console.error('❌ Failed to load:', error);
    }
  };

  // Add disease data function - FIXED VERSION
  const addDiseaseData = async (diseaseInfo, location) => {
    try {
      console.log('📤 Saving disease to database...');
      
      const payload = {
        userId: 'scanner-user',
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat]
        },
        diseaseType: diseaseInfo.class || 'Detected Disease',
        confidence: diseaseInfo.confidence || 0.9,
        intensity: diseaseInfo.confidence || 0.9,
        reportCount: 1,
        isDiseaseReport: true,
        detectionMethod: 'PLANT_SCANNER'
      };

      const response = await axios.post(`${API_BASE_URL}/api/locations`, payload);
      console.log('✅ Disease saved to database:', response.data._id);
      
      const newDisease = {
        id: response.data._id,
        diseaseType: payload.diseaseType,
        lat: location.lat,
        lng: location.lng,
        confidence: payload.confidence,
        timestamp: new Date().toISOString(),
        reportCount: 1,
        userId: payload.userId
      };

      
      setDiseaseData(prev => {
        const newArray = [...prev, newDisease];
        console.log('✅ State updated - Total diseases:', newArray.length);
        return newArray;
      });

      setRecentDiseaseAdded(newDisease);
      setTimeout(() => setRecentDiseaseAdded(null), 3000);

      setTimeout(() => {
        console.log('🔄 Force refreshing from database...');
        loadDiseasesFromDatabase();
      }, 2000);

      return newDisease;
    } catch (error) {
      console.error('❌ Save failed:', error);
      throw error;
    }
  };

  // Clear function
  const clearDiseaseData = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/locations`);
      setDiseaseData([]);
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Clear failed:', error);
      setDiseaseData([]);
    }
  };

  // Manual refresh function
  const refreshDiseaseData = () => {
    loadDiseasesFromDatabase();
  };

  return (
    <HeatmapContext.Provider 
      value={{ 
        addDiseaseToHeatmap: addDiseaseFunction, 
        setAddDiseaseFunction,
        isHeatmapReady,
        setIsHeatmapReady,
        diseaseData,
        addDiseaseData,
        recentDiseaseAdded,
        clearDiseaseData,
        refreshDiseaseData,
        loadDiseasesFromDatabase
      }}
    >
      {children}
    </HeatmapContext.Provider>
  );
};

export const useHeatmap = () => {
  const context = useContext(HeatmapContext);
  if (!context) {
    throw new Error('useHeatmap must be used within HeatmapProvider');
  }
  return context;
};
