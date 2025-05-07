// // src/components/AddressSelector.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
// import { selectIsAuthenticated } from '../redux/slices/authSlice';
// import { setSelectedAddress, selectSelectedAddress } from '../redux/slices/locationSlice';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// const AddressSelector = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const selectedAddress = useSelector(selectSelectedAddress);
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const modalRef = useRef(null);
//   const inputRef = useRef(null);
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markerRef = useRef(null);

//   // Initialize map when modal opens
//   useEffect(() => {
//     if (isModalOpen && mapRef.current && !mapInstanceRef.current) {
//       // Default center - Islamabad
//       const defaultLatLng = [33.6844, 73.0479];
      
//       // Create map
//       const map = L.map(mapRef.current).setView(defaultLatLng, 13);
      
//       // Add tile layer (OpenStreetMap)
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       }).addTo(map);
      
//       // Add marker
//       const marker = L.marker(defaultLatLng, {
//         draggable: true
//       }).addTo(map);
      
//       // Handle marker drag end
//       marker.on('dragend', async function(e) {
//         const position = marker.getLatLng();
//         setIsLoading(true);
        
//         try {
//           // Reverse geocoding using Nominatim
//           const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
//           const data = await response.json();
          
//           if (data.display_name) {
//             const addressObj = {
//               address: data.display_name,
//               lat: position.lat,
//               lng: position.lng
//             };
//             setSearchQuery(data.display_name);
//             setSelectedAddressLocal(addressObj);
//           }
//         } catch (error) {
//           console.error('Error reverse geocoding:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       });
      
//       // Handle map click
//       map.on('click', async function(e) {
//         const { lat, lng } = e.latlng;
//         marker.setLatLng([lat, lng]);
//         setIsLoading(true);
        
//         try {
//           // Reverse geocoding
//           const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//           const data = await response.json();
          
//           if (data.display_name) {
//             const addressObj = {
//               address: data.display_name,
//               lat: lat,
//               lng: lng
//             };
//             setSearchQuery(data.display_name);
//             setSelectedAddressLocal(addressObj);
//           }
//         } catch (error) {
//           console.error('Error reverse geocoding:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       });
      
//       mapInstanceRef.current = map;
//       markerRef.current = marker;
      
//       // If there's a selected address, set the map view to it
//       if (selectedAddress) {
//         map.setView([selectedAddress.lat, selectedAddress.lng], 15);
//         marker.setLatLng([selectedAddress.lat, selectedAddress.lng]);
//         setSearchQuery(selectedAddress.address);
//       }
//     }
    
//     // Clean up map when modal closes
//     return () => {
//       if (isModalOpen === false && mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//         markerRef.current = null;
//       }
//     };
//   }, [isModalOpen, selectedAddress]);
  
//   // Handle search
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;
    
//     setIsLoading(true);
//     try {
//       // Geocoding using Nominatim
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
//       );
//       const data = await response.json();
      
//       if (data.length > 0) {
//         const result = data[0];
//         const lat = parseFloat(result.lat);
//         const lng = parseFloat(result.lon);
        
//         // Update map and marker
//         if (mapInstanceRef.current && markerRef.current) {
//           mapInstanceRef.current.setView([lat, lng], 15);
//           markerRef.current.setLatLng([lat, lng]);
          
//           const addressObj = {
//             address: result.display_name,
//             lat: lat,
//             lng: lng
//           };
//           setSelectedAddressLocal(addressObj);
//         }
//       } else {
//         // No results found
//         alert('No addresses found matching your search.');
//       }
//     } catch (error) {
//       console.error('Error searching address:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Local state for selected address before saving to Redux
//   const [localSelectedAddress, setLocalSelectedAddress] = useState(selectedAddress);
  
//   const setSelectedAddressLocal = (address) => {
//     setLocalSelectedAddress(address);
//   };
  
//   // Get current location
//   const getCurrentLocation = () => {
//     setIsLoading(true);
    
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
          
//           if (mapInstanceRef.current && markerRef.current) {
//             mapInstanceRef.current.setView([latitude, longitude], 15);
//             markerRef.current.setLatLng([latitude, longitude]);
            
//             try {
//               // Reverse geocoding
//               const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//               );
//               const data = await response.json();
              
//               if (data.display_name) {
//                 const addressObj = {
//                   address: data.display_name,
//                   lat: latitude,
//                   lng: longitude
//                 };
//                 setSearchQuery(data.display_name);
//                 setSelectedAddressLocal(addressObj);
//               }
//             } catch (error) {
//               console.error('Error reverse geocoding:', error);
//             }
//           }
          
//           setIsLoading(false);
//         },
//         (error) => {
//           console.error('Error getting current location:', error);
//           setIsLoading(false);
//           alert('Unable to get your current location. Please check your browser permissions.');
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by this browser.');
//       setIsLoading(false);
//     }
//   };
  
//   // Save selected address to Redux
//   const handleSelectAddress = () => {
//     if (localSelectedAddress) {
//       dispatch(setSelectedAddress(localSelectedAddress));
//       setIsModalOpen(false);
//     }
//   };
  
//   // Handle Enter key in search input
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };
  
//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Don't render if not authenticated
//   if (!isAuthenticated) return null;

//   return (
//     <>
//       {/* Address Button in Navbar */}
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="flex items-center text-text mr-4 hover:text-accent transition-colors"
//       >
//         <FaMapMarkerAlt className="mr-1" />
//         <span className="hidden sm:inline-block max-w-[150px] overflow-hidden truncate">
//           {selectedAddress ? selectedAddress.address.split(',')[0] : 'Select Address'}
//         </span>
//       </button>

//       {/* Modal Overlay */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-text/70 z-50 flex items-center justify-center p-4">
//           <div
//             ref={modalRef}
//             className="bg-background rounded-lg w-full max-w-xl shadow-xl overflow-hidden"
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-4">
//               <h2 className="text-2xl font-bold text-text">Enter Address</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-text/50 hover:text-accent"
//               >
//                 <FaTimes size={24} />
//               </button>
//             </div>

//             {/* Instruction text */}
//             <div className="px-4 pb-4">
//               <p className="text-text/70">
//                 Please allow location for free delivery and good food experience.
//               </p>
//             </div>

//             {/* Search input with icon */}
//             <div className="px-4 pb-4 relative">
//               <div className="relative flex items-center">
//                 <FaMapMarkerAlt className="absolute left-3 text-text/50" />
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Enter location"
//                   className="w-full p-3 pl-10 pr-10 border border-primary/20 rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery('')}
//                     className="absolute right-10 text-text/50 hover:text-accent"
//                   >
//                     <FaTimes />
//                   </button>
//                 )}
//                 <button 
//                   onClick={handleSearch} 
//                   className="absolute right-3 text-accent hover:text-accent/80"
//                 >
//                   <FaMapMarkerAlt />
//                 </button>
//               </div>
//             </div>

//             {/* Map Container */}
//             <div className="w-full h-64 relative mb-4">
//               <div ref={mapRef} className="h-full w-full"></div>
//               {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-text/10 z-10">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//                 </div>
//               )}
//             </div>

//             {/* Selected Location Info */}
//             {localSelectedAddress && (
//               <div className="px-4 py-3">
//                 <div className="flex items-center px-4 py-3 bg-text/5 rounded-lg mb-4">
//                   <div className="bg-primary p-2 rounded-full mr-3">
//                     <FaMapMarkerAlt className="text-text" />
//                   </div>
//                   <div className="flex-1 overflow-hidden">
//                     <p className="font-medium text-text truncate">{localSelectedAddress.address}</p>
//                   </div>
//                   <button 
//                     onClick={handleSelectAddress}
//                     className="bg-primary text-text px-4 py-2 rounded-lg font-bold hover:bg-primary/80"
//                   >
//                     SELECT
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Use Current Location Button */}
//             <div className="px-4 pb-4">
//               <button
//                 onClick={getCurrentLocation}
//                 className="w-full bg-primary text-text py-3 rounded-lg font-medium hover:bg-primary/80 flex items-center justify-center"
//               >
//                 <FaMapMarkerAlt className="mr-2" />
//                 Use Current Location
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddressSelector;



// src/components/AddressSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaMapMarkerAlt, FaTimes, FaSearch } from 'react-icons/fa';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { setSelectedAddress, selectSelectedAddress } from '../redux/slices/locationSlice';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Set your MapBox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your actual token

const AddressSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const selectedAddress = useSelector(selectSelectedAddress);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const markerRef = useRef(null);
  
  // Initialize map when modal opens
  useEffect(() => {
    if (isModalOpen && mapContainerRef.current && !mapRef.current) {
      // Initial coordinates (Pakistan)
      const initialCoordinates = selectedAddress 
        ? [selectedAddress.lng, selectedAddress.lat]
        : [73.0479, 33.6844]; // Islamabad coordinates
      
      // Create map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: initialCoordinates,
        zoom: 12
      });
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Create a marker
      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat(initialCoordinates)
        .addTo(map);
      
      // Handle marker drag end
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        reverseGeocode(lngLat.lng, lngLat.lat);
      });
      
      // Create geocoder (search)
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Enter location',
        countries: 'pk', // Restrict to Pakistan
        proximity: {
          longitude: initialCoordinates[0],
          latitude: initialCoordinates[1]
        }
      });
      
      // Handle geocoder result
      geocoder.on('result', (e) => {
        const { result } = e;
        
        marker.setLngLat(result.center);
        
        const newAddress = {
          address: result.place_name,
          lng: result.center[0],
          lat: result.center[1]
        };
        
        setSearchQuery(result.place_name);
        setSearchResults([]);
      });
      
      // Store refs
      mapRef.current = map;
      markerRef.current = marker;
      geocoderRef.current = geocoder;
      
      // Wait for map to load
      map.on('load', () => {
        // If there's already a selected address, update the map
        if (selectedAddress) {
          map.setCenter([selectedAddress.lng, selectedAddress.lat]);
          marker.setLngLat([selectedAddress.lng, selectedAddress.lat]);
          setSearchQuery(selectedAddress.address);
        }
      });
      
      return () => {
        // Cleanup
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          markerRef.current = null;
          geocoderRef.current = null;
        }
      };
    }
  }, [isModalOpen, selectedAddress]);
  
  // Search for locations
  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=pk&limit=5`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setSearchResults(data.features);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLocations(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Reverse geocode (get address from coordinates)
  const reverseGeocode = async (lng, lat) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        setSearchQuery(place.place_name);
        
        const newAddress = {
          address: place.place_name,
          lng,
          lat
        };
        
        setTempSelectedAddress(newAddress);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting a search result
  const handleSelectResult = (result) => {
    if (mapRef.current && markerRef.current) {
      const [lng, lat] = result.center;
      
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15
      });
      
      markerRef.current.setLngLat([lng, lat]);
      
      const newAddress = {
        address: result.place_name,
        lng,
        lat
      };
      
      setTempSelectedAddress(newAddress);
      setSearchQuery(result.place_name);
      setSearchResults([]);
    }
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 15
            });
            
            markerRef.current.setLngLat([longitude, latitude]);
            
            // Get address from coordinates
            reverseGeocode(longitude, latitude);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
          alert('Could not get your current location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLoading(false);
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
  
  // Temporary selected address before confirming
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);
  
  // Save selected address to Redux
  const handleSaveAddress = () => {
    if (tempSelectedAddress) {
      dispatch(setSelectedAddress(tempSelectedAddress));
      setIsModalOpen(false);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
                  placeholder="Enter location"
                  className="w-full p-3 pl-10 pr-10 border border-primary/20 rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-10 text-text/50 hover:text-accent"
                  >
                    <FaTimes />
                  </button>
                )}
                <button className="absolute right-3 text-accent">
                  <FaSearch />
                </button>
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-background border border-text/10 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-2 hover:bg-text/5 cursor-pointer border-b border-text/10 last:border-b-0"
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="mt-1 mr-2 text-accent flex-shrink-0" />
                        <span className="text-text">{result.place_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="w-full h-64 relative">
              <div ref={mapContainerRef} className="w-full h-full" />
              {isLoading && (
                <div className="absolute inset-0 bg-text/20 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Selected Location */}
            {tempSelectedAddress && (
              <div className="p-4">
                <div className="flex items-start bg-text/5 p-3 rounded-lg">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-primary p-2 rounded-full">
                      <FaMapMarkerAlt className="text-text" />
                    </div>
                  </div>
                  <div className="flex-1 mr-3">
                    <p className="text-text font-medium truncate">{tempSelectedAddress.address}</p>
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="bg-primary text-text px-4 py-2 rounded-lg font-bold hover:bg-primary/80"
                  >
                    SELECT
                  </button>
                </div>
              </div>
            )}

            {/* Use Current Location Button */}
            <div className="px-4 py-4">
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