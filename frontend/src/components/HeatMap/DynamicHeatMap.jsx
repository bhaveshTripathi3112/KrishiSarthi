import React, { useState, useEffect, useRef, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { dataContext } from '../../contexts/UserContext';
import { useHeatmap } from '../../contexts/HeatmapContext';

export const DynamicHeatMap = () => {
  const { userData } = useContext(dataContext);
  const { 
    setAddDiseaseFunction, 
    setIsHeatmapReady, 
    diseaseData, 
    addDiseaseData
  } = useHeatmap();
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const diseaseMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);
  
  const [map, setMap] = useState(null);
  const [diseaseLocations, setDiseaseLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // ✅ FIXED: Load diseases from shared context with proper state update
  useEffect(() => {
    if (diseaseData && diseaseData.length >= 0) {
      console.log('📊 Loading shared diseases from context:', diseaseData.length);
      setDiseaseLocations([...diseaseData]); // Force new array reference
    }
  }, [diseaseData]);

  const addDiseaseToHeatmap = async (diseaseInfo, locationOverride = null) => {
    try {
      console.log('🦠 Adding disease to shared heatmap:', diseaseInfo);
      
      const targetLocation = locationOverride || userLocation;
      
      if (!targetLocation) {
        throw new Error('No location available');
      }

      // Add to shared database via context
      const newDisease = await addDiseaseData(diseaseInfo, targetLocation);
      console.log('✅ Disease added to shared database:', newDisease);

      return { success: true };
    } catch (error) {
      console.error('❌ Error adding disease to shared heatmap:', error);
      throw error;
    }
  };

  // PROVIDE FUNCTION TO CONTEXT
  useEffect(() => {
    console.log('🔗 Providing heatmap function to context...');
    setAddDiseaseFunction(() => addDiseaseToHeatmap);
    setIsHeatmapReady(true);
    
    return () => {
      setAddDiseaseFunction(null);
      setIsHeatmapReady(false);
    };
  }, [setAddDiseaseFunction, setIsHeatmapReady]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      try {
        const leafletMap = L.map(mapRef.current).setView([29.219577, 79.513203], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(leafletMap);

        mapInstanceRef.current = leafletMap;
        setMap(leafletMap);
        setTimeout(() => leafletMap.invalidateSize(), 100);

      } catch (error) {
        setError('Map initialization failed: ' + error.message);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Get user location when map is ready
  useEffect(() => {
    if (map) {
      getUserLocation();
    }
  }, [map]);

  // ✅ FIXED: AUTO-UPDATE When diseaseLocations state changes, update map
  useEffect(() => {
    console.log('🔄 Disease locations changed:', diseaseLocations.length);
    if (diseaseLocations.length > 0 && map) {
      updateDiseaseMarkersOnly(diseaseLocations);
    } else if (diseaseLocations.length === 0 && map) {
      // Clear all markers when no disease data
      diseaseMarkersRef.current.forEach(marker => {
        try {
          map.removeLayer(marker);
        } catch (e) {}
      });
      diseaseMarkersRef.current = [];
      console.log('✅ Cleared all disease markers from map');
    }
  }, [diseaseLocations, map]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date()
        };
        
        console.log('📍 User location obtained:', location);
        setUserLocation(location);
        
        if (map) {
          map.setView([location.lat, location.lng], 15);
          
          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }
          
          userMarkerRef.current = L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup('📍 Your Location')
            .openPopup();
        }
      },
      (error) => {
        setError('Unable to get location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // ✅ ENHANCED UPDATE FUNCTION WITH DETAILED RESOURCE POPUPS
  const updateDiseaseMarkersOnly = (diseaseLocs) => {
    if (!map || !diseaseLocs || diseaseLocs.length === 0) return;

    console.log('🦠 Updating shared disease markers with resource popups:', diseaseLocs.length);

    // Remove existing markers
    diseaseMarkersRef.current.forEach(marker => {
      try {
        map.removeLayer(marker);
      } catch (e) {}
    });
    diseaseMarkersRef.current = [];

    // Group diseases by location to count reports
    const locationGroups = {};
    diseaseLocs.forEach(disease => {
      const key = `${disease.lat.toFixed(6)},${disease.lng.toFixed(6)}`;
      if (!locationGroups[key]) {
        locationGroups[key] = {
          ...disease,
          reportCount: 0,
          diseases: [],
          userCount: new Set()
        };
      }
      locationGroups[key].reportCount += (disease.reportCount || 1);
      locationGroups[key].diseases.push(disease);
      locationGroups[key].userCount.add(disease.userId || 'anonymous');
    });

    // Create markers with dynamic colors and ENHANCED RESOURCE POPUPS
    Object.values(locationGroups).forEach((location, index) => {
      console.log(`🔴 Adding enhanced disease marker ${index}:`, location.lat, location.lng);
      
      // DYNAMIC COLOR BASED ON REPORT COUNT
      let color = '#4caf50';  // Green for 1 report (Low)
      if (location.reportCount >= 10) {
        color = '#d32f2f';    // Red for 10+ reports (Critical)
      } else if (location.reportCount >= 5) {
        color = '#ff9800';    // Orange for 5-9 reports (High)
      } else if (location.reportCount >= 2) {
        color = '#ffeb3b';    // Yellow for 2-4 reports (Medium)
      }

      // DYNAMIC RADIUS BASED ON REPORT COUNT
      const radius = Math.min(150 + (location.reportCount * 30), 500);

      const marker = L.circle([location.lat, location.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: radius,
        weight: 4
      }).addTo(map);

      // ✅ ENHANCED POPUP WITH DETAILED RESOURCE INFORMATION
      const diseaseList = location.diseases.map((d, i) => 
        `<div style="padding: 8px; margin: 4px 0; background: #f8f9fa; border-radius: 4px; border-left: 3px solid ${color};">
          <strong>Report #${i + 1}: ${d.diseaseType}</strong><br/>
          <small>📊 Confidence: ${((d.confidence || 0.9) * 100).toFixed(1)}%</small><br/>
          <small>⏰ Reported: ${new Date(d.timestamp).toLocaleString()}</small><br/>
          <small>👤 User: ${d.userId || 'Anonymous'}</small>
          ${d.detectionMethod ? `<br/><small>🔬 Method: ${d.detectionMethod}</small>` : ''}
        </div>`
      ).join('');
      
      const userCount = location.userCount.size;
      const severityLevel = location.reportCount >= 10 ? 'CRITICAL' : 
                           location.reportCount >= 5 ? 'HIGH' : 
                           location.reportCount >= 2 ? 'MEDIUM' : 'LOW';
      
      // Create comprehensive popup content with resources
      const enhancedPopupContent = `
        <div style="font-family: Arial, sans-serif; max-width: 350px; min-width: 280px;">
          <!-- Header -->
          <div style="text-align: center; padding: 12px; background: ${color}; color: white; margin: -12px -12px 12px -12px; border-radius: 4px 4px 0 0;">
            <h3 style="margin: 0; font-size: 16px;">🦠 Disease Alert Zone #${index + 1}</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Severity Level: ${severityLevel}</p>
          </div>
          
          <!-- Summary Statistics -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="text-align: center; padding: 8px; background: #e3f2fd; border-radius: 4px;">
              <strong style="display: block; font-size: 18px; color: #1976d2;">${location.reportCount}</strong>
              <small>Total Reports</small>
            </div>
            <div style="text-align: center; padding: 8px; background: #f3e5f5; border-radius: 4px;">
              <strong style="display: block; font-size: 18px; color: #7b1fa2;">${userCount}</strong>
              <small>Users Affected</small>
            </div>
          </div>
          
          <!-- Location Information -->
          <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
            <strong>📍 Location:</strong> ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}<br/>
            <strong>🔄 Last Updated:</strong> ${new Date(location.timestamp).toLocaleString()}
          </div>
          
          <!-- Disease Reports Details -->
          <div style="margin-bottom: 12px;">
            <strong style="display: block; margin-bottom: 8px;">📋 Disease Reports:</strong>
            <div style="max-height: 150px; overflow-y: auto;">
              ${diseaseList}
            </div>
          </div>
          
          <!-- ✅ RESOURCE LINKS & TREATMENT INFORMATION -->
          <div style="padding: 12px; background: #e8f5e8; border-radius: 4px; border: 1px solid #4caf50; margin-bottom: 8px;">
            <strong style="color: #2e7d32; display: block; margin-bottom: 8px;">🔗 Treatment & Resources:</strong>
            
            <div style="margin-bottom: 8px;">
              <a href="/treatment/${encodeURIComponent(location.diseases[0]?.diseaseType || 'general')}" target="_blank" 
                 style="color: #1976d2; text-decoration: none; font-size: 14px; display: inline-block; margin-right: 12px;">
                📖 Treatment Guide
              </a>
              <a href="/prevention-tips" target="_blank" 
                 style="color: #1976d2; text-decoration: none; font-size: 14px;">
                🛡️ Prevention Tips
              </a>
            </div>
            
            <div style="margin-bottom: 8px;">
              <a href="/organic-solutions" target="_blank" 
                 style="color: #4caf50; text-decoration: none; font-size: 14px; margin-right: 12px;">
                🌱 Organic Solutions
              </a>
              <a href="/nearby-experts" target="_blank" 
                 style="color: #ff9800; text-decoration: none; font-size: 14px;">
                👨‍🌾 Find Experts
              </a>
            </div>
          </div>
          
          <!-- ✅ ACTION BUTTONS -->
          <div style="padding: 12px; background: #fff3e0; border-radius: 4px; border: 1px solid #ff9800;">
            <strong style="color: #ef6c00; display: block; margin-bottom: 8px;">🚨 Take Action:</strong>
            
            <div>
              <a href="/report-similar?disease=${encodeURIComponent(location.diseases[0]?.diseaseType || '')}" target="_blank" 
                 style="color: #d32f2f; text-decoration: none; font-size: 14px; display: inline-block; margin-right: 12px;">
                📝 Report Similar Issue
              </a>
              <a href="/emergency-contact" target="_blank" 
                 style="color: #d32f2f; text-decoration: none; font-size: 14px;">
                🆘 Emergency Help
              </a>
            </div>
            
            <div style="margin-top: 8px;">
              <a href="tel:+1-800-AGRI-HELP" 
                 style="color: #1976d2; text-decoration: none; font-size: 14px; margin-right: 12px;">
                📞 Call Helpline
              </a>
              <a href="/share-location?lat=${location.lat}&lng=${location.lng}" target="_blank" 
                 style="color: #4caf50; text-decoration: none; font-size: 14px;">
                📤 Share Location
              </a>
            </div>
          </div>
          
          <!-- Severity Legend -->
          <div style="margin-top: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 11px;">
            <strong>🎨 Severity Levels:</strong><br/>
            <span style="color: #4caf50;">● 1 report (LOW)</span> | 
            <span style="color: #ffeb3b;">● 2-4 reports (MEDIUM)</span><br/>
            <span style="color: #ff9800;">● 5-9 reports (HIGH)</span> | 
            <span style="color: #d32f2f;">● 10+ reports (CRITICAL)</span>
          </div>
        </div>
      `;
      
      // Bind the comprehensive popup to the marker
      marker.bindPopup(enhancedPopupContent, {
        maxWidth: 400,
        minWidth: 280,
        className: 'disease-resource-popup'
      });

      diseaseMarkersRef.current.push(marker);
    });

    console.log(`✅ Added ${diseaseMarkersRef.current.length} enhanced disease markers with resource links`);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div
        ref={mapRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100vh',
          width: '100%'
        }}
      />
      
      {/* ✅ COLLAPSIBLE TOGGLE BUTTON */}
      <button
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        style={{
          position: 'absolute',
          top: 10,
          right: isPanelVisible ? '320px' : '10px',
          background: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '18px',
          zIndex: 1001,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
        title={isPanelVisible ? 'Hide Panel' : 'Show Panel'}
      >
        {isPanelVisible ? '✕' : '📊'}
      </button>
      
      {/* ✅ CLEAN & COLLAPSIBLE CONTROL PANEL */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: isPanelVisible ? '10px' : '-320px',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        width: '300px',
        border: '2px solid #d32f2f',
        transition: 'right 0.3s ease',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '18px', 
          color: '#d32f2f',
          textAlign: 'center',
          borderBottom: '2px solid #d32f2f',
          paddingBottom: '10px'
        }}>
          🦠 Disease HeatMap
        </h3>

        {/* ✅ FIXED: REAL-TIME STATS DISPLAY */}
        <div style={{ 
          fontSize: '14px', 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          marginBottom: '15px',
          border: '1px solid #e9ecef'
        }}>
          <strong>📊 Current Status:</strong><br />
          <div style={{ marginTop: '8px' }}>
            <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>
              {diseaseLocations.length} Disease Reports
            </span>
            <br />
            <span style={{ color: '#6c757d', fontSize: '12px' }}>
              {diseaseMarkersRef.current.length} Active Markers
            </span>
            <br />
            <span style={{ color: '#17a2b8', fontSize: '11px' }}>
              Auto-refreshes every 10 seconds
            </span>
          </div>
        </div>

        {/* ✅ USER LOCATION INFO */}
        {userLocation && (
          <div style={{ 
            fontSize: '12px', 
            padding: '10px', 
            backgroundColor: '#d4edda', 
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #c3e6cb'
          }}>
            <strong>📍 Your Location:</strong><br />
            <code style={{ fontSize: '11px', color: '#495057' }}>
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </code>
          </div>
        )}

        {/* ✅ ERROR DISPLAY */}
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ✅ INSTRUCTIONS */}
        <div style={{
          padding: '12px',
          backgroundColor: '#cce7ff',
          color: '#004085',
          borderRadius: '8px',
          fontSize: '13px',
          marginBottom: '15px',
          border: '1px solid #b3d9ff'
        }}>
          <strong>💡 How to Use:</strong><br />
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px' }}>
            <li>Click red circles for detailed disease info</li>
            <li>Use scanner to add new disease reports</li>
            <li>View treatment resources in popups</li>
          </ul>
        </div>

        {/* ✅ SEVERITY LEGEND */}
        <div style={{ 
          fontSize: '12px', 
          padding: '12px', 
          backgroundColor: '#fff', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <strong style={{ display: 'block', marginBottom: '8px' }}>🎨 Severity Levels:</strong>
          <div style={{ lineHeight: '1.6' }}>
            <div><span style={{ color: '#4caf50', fontSize: '16px' }}>●</span> 1 report (Low Risk)</div>
            <div><span style={{ color: '#ffeb3b', fontSize: '16px' }}>●</span> 2-4 reports (Medium Risk)</div>
            <div><span style={{ color: '#ff9800', fontSize: '16px' }}>●</span> 5-9 reports (High Risk)</div>
            <div><span style={{ color: '#d32f2f', fontSize: '16px' }}>●</span> 10+ reports (Critical Risk)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
