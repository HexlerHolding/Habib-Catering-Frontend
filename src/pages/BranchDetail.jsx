import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaClock, FaMapMarkerAlt, FaDirections } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { branchesData } from './BranchLocator'; // Import the branch data from BranchLocator

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const BranchDetail = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  
  // Fetch branch data from the imported branchesData
  useEffect(() => {
    // Simulate API call with a short timeout for loading state demonstration
    const fetchBranch = () => {
      setLoading(true);
      setTimeout(() => {
        const foundBranch = branchesData.find(b => b.id === parseInt(branchId));
        setBranch(foundBranch || null);
        setLoading(false);
      }, 500);
    };
    
    fetchBranch();
  }, [branchId]);
  
  // Initialize map when branch data is available
  useEffect(() => {
    if (branch && mapRef.current) {
      const { lat, lng } = branch.coordinates;
      
      // Create map centered on branch location
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      
      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
      
      // Add marker for branch location with custom popup
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${branch.name}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 8px;">${branch.address}</p>
        </div>
      `;
      
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();
      
      // Clean up on unmount
      return () => {
        map.remove();
      };
    }
  }, [branch]);
  
  // Function to open Google Maps directions
  const getDirections = () => {
    if (!branch) return;
    
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Open Google Maps with directions from current location to branch
          window.open(
            `https://www.google.com/maps/dir/${latitude},${longitude}/${branch.coordinates.lat},${branch.coordinates.lng}`,
            '_blank'
          );
        },
        // If geolocation fails, just open the branch location
        () => {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${branch.coordinates.lat},${branch.coordinates.lng}`,
            '_blank'
          );
        }
      );
    } else {
      // Fallback if geolocation is not supported
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${branch.coordinates.lat},${branch.coordinates.lng}`,
        '_blank'
      );
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text/70">Loading branch information...</p>
        </div>
      </div>
    );
  }
  
  // Branch not found
  if (!branch) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to='/branches' className="inline-flex items-center text-primary hover:text-primary/80">
            <FaArrowLeft className="mr-2" />
            Back to Branches
          </Link>
        </div>
        
        <div className="bg-background rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-text mb-4">Branch Not Found</h1>
          <p className="text-text/70 mb-6">The branch you're looking for doesn't exist or has been moved.</p>
          <Link 
            to="/branches" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-secondary bg-primary hover:bg-primary/80"
          >
            View All Branches
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
      {/* Back Button and Header */}
      <div className="mb-6">
        <Link to='/branches' className="inline-flex items-center text-2xl font-bold text-text hover:underline"> 
          <FaArrowLeft className="mr-2" />
          Back to Branches
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branch Information */}
        <div className="md:col-span-1">
          <div className="bg-background rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-text/80 mb-2">{branch.name}</h1>
              <p className="text-text/60 mb-6">{branch.city}</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="h-5 w-5 text-primary mt-1 mr-3" />
                  <p className="text-text/70">{branch.address}</p>
                </div>
                
                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-primary mr-3" />
                  <p className="text-text/70">{branch.phone}</p>
                </div>
                
                <div className="flex items-center">
                  <FaClock className="h-5 w-5 text-primary mr-3" />
                  <p className="text-text/70">{branch.timings}</p>
                </div>
              </div>
              
              <button
                onClick={getDirections}
                className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium bg-primary hover:bg-primary/80 hover:brightness-105 transition duration-300 text-text"
              >
                <FaDirections className="mr-2" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="md:col-span-2 z-10">
          <div className="bg-background rounded-lg shadow overflow-hidden h-96">
            <div ref={mapRef} className="h-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
