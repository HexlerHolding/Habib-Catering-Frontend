import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaClock, FaDirections, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import branchService from '../../Services/branchService';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper function to generate approximate coordinates for cities
const getCityCoordinates = (city) => {
  const cityCoordinates = {
    'Lahore': { lat: 31.5204, lng: 74.3587 },
    'Islamabad': { lat: 33.6844, lng: 73.0479 },
    'Karachi': { lat: 24.8607, lng: 67.0011 },
    'Rawalpindi': { lat: 33.6007, lng: 73.0679 },
    'Faisalabad': { lat: 31.4180, lng: 73.0793 },
    'Multan': { lat: 30.1959, lng: 71.4693 },
    'Peshawar': { lat: 34.0081, lng: 71.5249 },
    // Add more cities as needed
  };
  
  // Normalize city name by converting to lowercase and removing extra spaces
  const normalizedCity = city ? city.toLowerCase().trim() : '';
  
  // Find city in cityCoordinates (case-insensitive match)
  for (const [key, value] of Object.entries(cityCoordinates)) {
    if (key.toLowerCase() === normalizedCity) {
      return value;
    }
  }
  
  // If we can extract a city name from the address, try that
  if (normalizedCity.includes("islamabad")) {
    return cityCoordinates["Islamabad"];
  }
  
  // Default to Pakistan's center
  return { lat: 30.3753, lng: 69.3451 };
};

const BranchDetail = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Fetch branch details from API
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        setError(null);
        const branchData = await branchService.getBranchDetails(branchId);
        
        if (!branchData) {
          throw new Error('Branch not found');
        }
        
        // If coordinates are missing or invalid, add approximate ones based on city
        if (!branchService.hasValidCoordinates(branchData)) {
          // Create a deep copy to avoid mutating the original data
          const branchWithCoords = { ...branchData };
          
          // Add coordinates based on city or address
          if (branchWithCoords.city) {
            branchWithCoords.coordinates = getCityCoordinates(branchWithCoords.city);
            console.log(`Generated coordinates for ${branchWithCoords.name} based on city:`, branchWithCoords.coordinates);
          } 
          // If no city, try to extract from address
          else if (branchWithCoords.address) {
            const addressLower = branchWithCoords.address.toLowerCase();
            // Check if address contains a known city
            for (const city of Object.keys(getCityCoordinates(""))) {
              if (addressLower.includes(city.toLowerCase())) {
                branchWithCoords.coordinates = getCityCoordinates(city);
                console.log(`Generated coordinates for ${branchWithCoords.name} based on address:`, branchWithCoords.coordinates);
                break;
              }
            }
          }
          
          setBranch(branchWithCoords);
        } else {
          setBranch(branchData);
        }
      } catch (err) {
        console.error('Error fetching branch details:', err);
        setError(err.message);
        setBranch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [branchId]);

  // Initialize map when branch data is available
  useEffect(() => {
    if (branch && mapRef.current) {
      let coordinates;
      
      // Check if coordinates exist and are valid
      if (branchService.hasValidCoordinates(branch)) {
        coordinates = branch.coordinates;
      } 
      // Use approximate coordinates based on city or address
      else if (branch.city) {
        coordinates = getCityCoordinates(branch.city);
        console.log(`Using approximate coordinates for ${branch.name} based on city:`, coordinates);
      } 
      else if (branch.address && branch.address.toLowerCase().includes('islamabad')) {
        coordinates = getCityCoordinates('Islamabad');
        console.log(`Using approximate coordinates for ${branch.name} based on address:`, coordinates);
      }
      else {
        // Default coordinates (Pakistan center)
        coordinates = { lat: 30.3753, lng: 69.3451 };
        console.log(`Using default Pakistan coordinates for ${branch.name}:`, coordinates);
      }
      
      const { lat, lng } = coordinates;

      // Create map centered on branch location
      const map = L.map(mapRef.current).setView([lat, lng], 15);

      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
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
    
    let coordinates;
    
    // Check if coordinates exist and are valid
    if (branchService.hasValidCoordinates(branch)) {
      coordinates = branch.coordinates;
    } 
    // Use approximate coordinates based on city or address
    else if (branch.city) {
      coordinates = getCityCoordinates(branch.city);
    } 
    else if (branch.address && branch.address.toLowerCase().includes('islamabad')) {
      coordinates = getCityCoordinates('Islamabad');
    }
    else {
      // Default coordinates (Pakistan center)
      coordinates = { lat: 30.3753, lng: 69.3451 };
    }

    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Open Google Maps with directions from current location to branch
          window.open(
            `https://www.google.com/maps/dir/${latitude},${longitude}/${coordinates.lat},${coordinates.lng}`,
            '_blank'
          );
        },
        // If geolocation fails, just open the branch location
        () => {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
            '_blank'
          );
        }
      );
    } else {
      // Fallback if geolocation is not supported
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
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

  // Error state
  if (error || !branch) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/branches" className="inline-flex items-center text-primary hover:text-primary/80">
            <FaArrowLeft className="mr-2" />
            Back to Branches
          </Link>
        </div>
        <div className="bg-background rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-text mb-4">Branch Not Found</h1>
          <p className="text-text/70 mb-6">
            {error || "The branch you're looking for doesn't exist or has been moved."}
          </p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 mt-9 bg-background">
      {/* Back Button and Header */}
        <button
        className="flex items-center text-primary cursor-pointer hover:text-accent font-medium mb-4 px-2 py-1 rounded transition-colors self-start"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>

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

                {branch.contact && (
                  <div className="flex items-center">
                    <FaPhone className="h-5 w-5 text-primary mr-3" />
                    <p className="text-text/70">{branch.contact}</p>
                  </div>
                )}

                {(branch.openingTime && branch.closingTime) && (
                  <div className="flex items-center">
                    <FaClock className="h-5 w-5 text-primary mr-3" />
                    <p className="text-text/70">{branch.openingTime} - {branch.closingTime}</p>
                  </div>
                )}
              </div>

              <button
                onClick={getDirections}
                className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium bg-primary hover:bg-primary/80 hover:brightness-105 transition duration-300 text-secondary"
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