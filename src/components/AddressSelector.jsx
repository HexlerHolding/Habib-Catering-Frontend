// src/components/AddressSelector.jsx
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { FaBuilding, FaHome, FaList, FaMapMarkerAlt, FaSave, FaSpinner, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserId } from '../redux/slices/authSlice';
import {
  addSavedAddress,
  deleteUserAddress,
  fetchUserAddresses,
  saveUserAddress,
  selectLocationError,
  selectLocationStatus,
  selectSavedAddresses,
  selectSelectedAddress,
  setSelectedAddress,
  setUserSelectedAddress
} from '../redux/slices/locationSlice';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AddressSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressList, setIsAddressList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [showSaveOption, setShowSaveOption] = useState(false);

  const dispatch = useDispatch();
  const selectedAddress = useSelector(selectSelectedAddress);
  const savedAddresses = useSelector(selectSavedAddresses);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userId = useSelector(selectUserId);
  const locationStatus = useSelector(selectLocationStatus);
  const locationError = useSelector(selectLocationError);

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Fetch user's addresses when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserAddresses(userId));
    }
  }, [isAuthenticated, userId, dispatch]);

  // Initialize map when modal opens
  useEffect(() => {
    if (isModalOpen && mapRef.current && !mapInstanceRef.current && !isAddressList) {
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
      if (!isModalOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isModalOpen, selectedAddress, isAddressList]);
  
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
    // When a new address is selected, show the save option
    setShowSaveOption(true);
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
  
  // Save selected address to Redux and user profile
  const handleSelectAddress = () => {
    if (localSelectedAddress && isAuthenticated && userId) {
      // Create a unique ID if this is a new address
      const addressToSave = {
        ...localSelectedAddress,
        id: localSelectedAddress.id || Date.now().toString()
      };
      
      // Dispatch to Redux and save to user profile
      dispatch(setUserSelectedAddress({ userId, address: addressToSave }))
        .unwrap()
        .then(() => {
          // Close modal and reset states
          setIsModalOpen(false);
          setIsAddressList(false);
          setShowSaveOption(false);
          setAddressName('');
        })
        .catch(error => {
          console.error('Failed to set selected address:', error);
          // Fallback to local storage if API call fails
          dispatch(setSelectedAddress(addressToSave));
          setIsModalOpen(false);
          setIsAddressList(false);
          setShowSaveOption(false);
          setAddressName('');
        });
    } else if (localSelectedAddress) {
      // If not authenticated, just use local Redux state
      const addressToSave = {
        ...localSelectedAddress,
        id: localSelectedAddress.id || Date.now().toString()
      };
      
      dispatch(setSelectedAddress(addressToSave));
      setIsModalOpen(false);
      setIsAddressList(false);
      setShowSaveOption(false);
      setAddressName('');
    }
  };
  
  // Save address to saved addresses list and user profile
  const handleSaveAddress = () => {
    if (!localSelectedAddress) return;
    
    // Safely check if address is already saved by ensuring savedAddresses exists
    const addressList = savedAddresses || [];
    const isAlreadySaved = addressList.some(addr => 
      addr && // Check that the address item exists
      Math.abs(addr.lat - localSelectedAddress.lat) < 0.0001 && 
      Math.abs(addr.lng - localSelectedAddress.lng) < 0.0001
    );
    
    if (isAlreadySaved) {
      alert('This address is already saved.');
      return;
    }
    
    // Create a new address object with name and ID
    const newAddress = {
      ...localSelectedAddress,
      name: addressName.trim() || 'Unnamed Location',
      id: Date.now().toString()
    };
    
    if (isAuthenticated && userId) {
      // Save to user's profile in database
      dispatch(saveUserAddress({ userId, address: newAddress }))
        .unwrap()
        .then(() => {
          // Also set as selected address
          dispatch(setUserSelectedAddress({ userId, address: newAddress }))
            .unwrap()
            .then(() => {
              // Reset states
              setShowSaveOption(false);
              setAddressName('');
              setIsModalOpen(false);
              setIsAddressList(false);
              
              // Show success message
              alert('Address saved successfully!');
            });
        })
        .catch(error => {
          console.error('Failed to save address:', error);
          // Fallback to local storage if API call fails
          dispatch(addSavedAddress(newAddress));
          dispatch(setSelectedAddress(newAddress));
          
          setShowSaveOption(false);
          setAddressName('');
          setIsModalOpen(false);
          setIsAddressList(false);
          
          alert('Address saved locally. You may need to log in again to sync with your account.');
        });
    } else {
      // Save locally if not authenticated
      dispatch(addSavedAddress(newAddress));
      dispatch(setSelectedAddress(newAddress));
      
      setShowSaveOption(false);
      setAddressName('');
      setIsModalOpen(false);
      setIsAddressList(false);
      
      alert('Address saved successfully!');
    }
  };
  
  // Delete an address
  const handleDeleteAddress = (addressId) => {
    if (!addressId) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      if (isAuthenticated && userId) {
        // Delete from user's profile in database
        dispatch(deleteUserAddress({ userId, addressId }))
          .unwrap()
          .catch(error => {
            console.error('Failed to delete address:', error);
            alert('Failed to delete address. Please try again.');
          });
      } else {
        // Delete locally if not authenticated
        dispatch(removeAddress(addressId));
      }
    }
  };

  // Select a saved address
  const handleSelectSavedAddress = (address) => {
    if (isAuthenticated && userId) {
      dispatch(setUserSelectedAddress({ userId, address }))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          setIsAddressList(false);
        })
        .catch(error => {
          console.error('Failed to set selected address:', error);
          // Fallback to local storage
          dispatch(setSelectedAddress(address));
          setIsModalOpen(false);
          setIsAddressList(false);
        });
    } else {
      dispatch(setSelectedAddress(address));
      setIsModalOpen(false);
      setIsAddressList(false);
    }
  };

  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Toggle between map and address list views
  const toggleAddressList = () => {
    setIsAddressList(!isAddressList);
    
    // If switching to map view, reset map
    if (isAddressList && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        setIsAddressList(false);
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
        data-testid="address-selector-btn"
        className="flex items-center text-text mr-4 hover:text-accent transition-colors"
      >
        <FaMapMarkerAlt className="mr-1" />
        <span className="hidden sm:inline-block max-w-[150px] overflow-hidden truncate">
          {selectedAddress ? (selectedAddress.name || selectedAddress.address.split(',')[0]) : 'Select Address'}
        </span>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/70 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-background rounded-lg w-full h-[90vh] overflow-auto max-w-xl shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-text/10">
              <h2 className="text-2xl font-bold text-text">
                {isAddressList ? 'Your Saved Addresses' : 'Enter Address'}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleAddressList}
                  className="text-primary hover:text-primary/80"
                  title={isAddressList ? "Find New Address" : "View Saved Addresses"}
                >
                  {isAddressList ? <FaMapMarkerAlt size={20} /> : <FaList size={20} />}
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsAddressList(false);
                  }}
                  className="text-text/50 hover:text-accent"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Loading Indicator for API calls */}
            {locationStatus === 'loading' && (
              <div className="fixed inset-0 bg-text/20 z-50 flex items-center justify-center">
                <div className="bg-background p-6 rounded-lg shadow-xl flex items-center">
                  <FaSpinner className="text-primary text-2xl animate-spin mr-3" />
                  <span>Processing...</span>
                </div>
              </div>
            )}

            {isAddressList ? (
              /* Saved Addresses List */
              <div className="p-4">
                {savedAddresses && savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`p-4 border rounded-lg flex items-start cursor-pointer transition-colors ${
                          selectedAddress && selectedAddress.id === address.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-text/10 hover:border-primary'
                        }`}
                        onClick={() => handleSelectSavedAddress(address)}
                      >
                        <div className={`p-3 rounded-full mr-3 ${
                          selectedAddress && selectedAddress.id === address.id 
                            ? 'bg-primary text-background' 
                            : 'bg-text/10'
                        }`}>
                          {address.name && address.name.toLowerCase().includes('home') ? (
                            <FaHome />
                          ) : address.name && address.name.toLowerCase().includes('office') ? (
                            <FaBuilding />
                          ) : (
                            <FaMapMarkerAlt />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{address.name || 'Unnamed Location'}</h3>
                          <p className="text-text/70 text-sm line-clamp-2">{address.address}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="text-accent hover:text-red-600 p-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-text/30" />
                    <p className="text-lg font-medium mb-2">No saved addresses</p>
                    <p className="text-text/50 mb-4">You haven't saved any addresses yet.</p>
                    <button
                      onClick={toggleAddressList}
                      className="bg-primary text-background px-6 py-3 rounded-lg font-medium"
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Map View */
              <>
                {/* Instruction text */}
                <div className="px-4 py-3">
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
                
                {/* Save Address Option */}
                {showSaveOption && localSelectedAddress && (
                  <div className="px-4 pb-4">
                    <div className="border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <FaSave className="text-primary mr-2" />
                        <h3 className="font-medium">Save this address for later</h3>
                      </div>
                      <input
                        type="text"
                        value={addressName}
                        onChange={(e) => setAddressName(e.target.value)}
                        placeholder="Location name (e.g. Home, Office)"
                        className="w-full p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary mb-3"
                      />
                      <button
                        onClick={handleSaveAddress}
                        className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent/90"
                      >
                        Save Address
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSelector;