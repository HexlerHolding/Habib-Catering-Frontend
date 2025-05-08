// src/components/AddressSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { setSelectedAddress, selectSelectedAddress } from '../redux/slices/locationSlice';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AddressSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedAddress = useSelector(selectSelectedAddress);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map when modal opens
  useEffect(() => {
    if (isModalOpen && mapRef.current && !mapInstanceRef.current) {
      // Default center - Islamabad
      const defaultLatLng = [33.6844, 73.0479];
      
      // Create map
      const map = L.map(mapRef.current).setView(defaultLatLng, 13);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add marker
      const marker = L.marker(defaultLatLng, {
        draggable: true
      }).addTo(map);
      
      // Handle marker drag end
      marker.on('dragend', async function(e) {
        const position = marker.getLatLng();
        setIsLoading(true);
        
        try {
          // Reverse geocoding using Nominatim with English language parameter
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&accept-language=en&addressdetails=1`);
          const data = await response.json();
          
          if (data.display_name) {
            const addressObj = {
              address: data.display_name,
              lat: position.lat,
              lng: position.lng
            };
            setSearchQuery(data.display_name);
            setSelectedAddressLocal(addressObj);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        } finally {
          setIsLoading(false);
        }
      });
      
      // Handle map click
      map.on('click', async function(e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setIsLoading(true);
        
        try {
          // Reverse geocoding with English language parameter
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&addressdetails=1`);
          const data = await response.json();
          
          if (data.display_name) {
            const addressObj = {
              address: data.display_name,
              lat: lat,
              lng: lng
            };
            setSearchQuery(data.display_name);
            setSelectedAddressLocal(addressObj);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        } finally {
          setIsLoading(false);
        }
      });
      
      mapInstanceRef.current = map;
      markerRef.current = marker;
      
      // If there's a selected address, set the map view to it
      if (selectedAddress) {
        map.setView([selectedAddress.lat, selectedAddress.lng], 15);
        marker.setLatLng([selectedAddress.lat, selectedAddress.lng]);
        setSearchQuery(selectedAddress.address);
      }
    }
    
    // Clean up map when modal closes
    return () => {
      if (isModalOpen === false && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isModalOpen, selectedAddress]);
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Geocoding using Nominatim with English language parameter
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=en&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // Update map and marker
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
          
          const addressObj = {
            address: result.display_name,
            lat: lat,
            lng: lng
          };
          setSelectedAddressLocal(addressObj);
        }
      } else {
        // No results found
        alert('No addresses found matching your search.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Local state for selected address before saving to Redux
  const [localSelectedAddress, setLocalSelectedAddress] = useState(selectedAddress);
  
  const setSelectedAddressLocal = (address) => {
    setLocalSelectedAddress(address);
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
            
            try {
              // Reverse geocoding with English language parameter
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en&addressdetails=1`
              );
              const data = await response.json();
              
              if (data.display_name) {
                const addressObj = {
                  address: data.display_name,
                  lat: latitude,
                  lng: longitude
                };
                setSearchQuery(data.display_name);
                setSelectedAddressLocal(addressObj);
              }
            } catch (error) {
              console.error('Error reverse geocoding:', error);
            }
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
          alert('Unable to get your current location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };
  
  // Save selected address to Redux
  const handleSelectAddress = () => {
    if (localSelectedAddress) {
      dispatch(setSelectedAddress(localSelectedAddress));
      setIsModalOpen(false);
    }
  };
  
  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Address Button in Navbar */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center text-text mr-4 hover:text-accent transition-colors"
      >
        <FaMapMarkerAlt className="mr-1" />
        <span className="hidden sm:inline-block max-w-[150px] overflow-hidden truncate">
          {selectedAddress ? selectedAddress.address.split(',')[0] : 'Select Address'}
        </span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/70 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-background rounded-lg w-full max-w-xl shadow-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold text-text">Enter Address</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text/50 hover:text-accent"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Instruction text */}
            <div className="px-4 pb-4">
              <p className="text-text/70">
                Please allow location for free delivery and good food experience.
              </p>
            </div>

            {/* Search input with icon */}
            <div className="px-4 pb-4 relative">
              <div className="relative flex items-center">
                <FaMapMarkerAlt className="absolute left-3 text-text/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter location"
                  className="w-full p-3 pl-10 pr-20 border border-primary/20 rounded-full focus:outline-none focus:ring-1 focus:ring-primary truncate"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 text-text/50 hover:text-accent"
                  >
                    <FaTimes />
                  </button>
                )}
                <button 
                  onClick={handleSearch} 
                  className="absolute right-3 text-accent hover:text-accent/80"
                >
                  <FaMapMarkerAlt />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-64 relative mb-4">
              <div ref={mapRef} className="h-full w-full"></div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-text/10 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Selected Location Info */}
            {localSelectedAddress && (
              <div className="px-4 py-3">
                <div className="flex items-center px-4 py-3 bg-text/5 rounded-lg mb-4">
                  <div className="bg-primary p-2 rounded-full mr-3">
                    <FaMapMarkerAlt className="text-text" />
                  </div>
                  <div className="flex-1 overflow-hidden pr-2">
                    <p className="font-medium text-text truncate">{localSelectedAddress.address}</p>
                  </div>
                  <button 
                    onClick={handleSelectAddress}
                    className="bg-primary text-text px-4 py-2 rounded-lg font-bold hover:bg-primary/80 flex-shrink-0"
                  >
                    SELECT
                  </button>
                </div>
              </div>
            )}

            {/* Use Current Location Button */}
            <div className="px-4 pb-4">
              <button
                onClick={getCurrentLocation}
                className="w-full bg-primary text-text py-3 rounded-lg font-medium hover:bg-primary/80 flex items-center justify-center"
              >
                <FaMapMarkerAlt className="mr-2" />
                Use Current Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSelector;