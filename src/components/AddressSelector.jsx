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
import toast from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal';
import branchService from '../../Services/branchService';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

const AddressSelector = ({ onAddressSelected, onClose, forceMapView }) => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector(selectSelectedAddress);
  const savedAddresses = useSelector(selectSavedAddresses);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [isModalOpen, setIsModalOpen] = useState(!!onClose); // Start with modal open when used as controlled component
  const [isAddressList, setIsAddressList] = useState(!forceMapView && isAuthenticated); // Use forceMapView prop
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [showSaveOption, setShowSaveOption] = useState(false);
  const [branches, setBranches] = useState([]);
  const userId = useSelector(selectUserId);
  const locationStatus = useSelector(selectLocationStatus);
  const locationError = useSelector(selectLocationError);

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Modal state for confirmation
const [confirmModal, setConfirmModal] = useState({
  open: false,
  title: '',
  message: '',
  onConfirm: null,
});

// Helper to open confirmation modal
const openConfirmModal = ({ title, message, onConfirm }) => {
  setConfirmModal({
    open: true,
    title,
    message,
    onConfirm,
  });
};

// Helper to close modal
const closeConfirmModal = () => {
  setConfirmModal({ ...confirmModal, open: false });
};

  // Fetch user's addresses when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserAddresses(userId));
    }
  }, [isAuthenticated, userId, dispatch]);

  // Fetch branches on mount
  useEffect(() => {
    branchService.getBranches().then((data) => {
      setBranches(data.filter(b => b.latitude && b.longitude));
    });
  }, []);

  // Initialize map when modal opens
  useEffect(() => {
    if ((isModalOpen || onClose) && mapRef.current && !mapInstanceRef.current && !isAddressList) {
      // Try to get user's current location first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const userLatLng = [latitude, longitude];
            // Create map centered on user's location
            const map = L.map(mapRef.current).setView(userLatLng, 15);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19
            }).addTo(map);
            const marker = L.marker(userLatLng, { draggable: true }).addTo(map);
            // Reverse geocode to get address, and set it in the input field
            setIsLoading(true);
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en&addressdetails=1`);
              const data = await response.json();
              if (data.display_name) {
                const addressObj = {
                  address: data.display_name,
                  lat: latitude,
                  lng: longitude
                };
                setSearchQuery(data.display_name); // Set input field to marker location
                setSelectedAddressLocal(addressObj);
              }
            } catch (error) {
              console.error('Error reverse geocoding:', error);
            } finally {
              setIsLoading(false);
            }
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
              if (!isWithin10Km(lat, lng)) {
                toast.error('Sorry, we only deliver within 10 km of our branches.');
                return;
              }
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
                  setSearchQuery(data.display_name); // Always update input field
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
          },
          // If geolocation fails, fallback to selectedAddress or Islamabad
          () => {
            const fallbackLatLng = selectedAddress
              ? [selectedAddress.lat, selectedAddress.lng]
              : [33.6844, 73.0479];
            const map = L.map(mapRef.current).setView(fallbackLatLng, 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19
            }).addTo(map);
            const marker = L.marker(fallbackLatLng, { draggable: true }).addTo(map);
            mapInstanceRef.current = map;
            markerRef.current = marker;
          }
        );
      } else {
        // If geolocation is not supported, fallback to selectedAddress or Islamabad
        const fallbackLatLng = selectedAddress
          ? [selectedAddress.lat, selectedAddress.lng]
          : [33.6844, 73.0479];
        const map = L.map(mapRef.current).setView(fallbackLatLng, 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);
        const marker = L.marker(fallbackLatLng, { draggable: true }).addTo(map);
        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    }
    
    // Clean up map when modal closes
    return () => {
      if ((!isModalOpen && !onClose) && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isModalOpen, selectedAddress, isAddressList, onClose]);
  
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
        if (!isWithin10Km(lat, lng)) {
          toast.error('Sorry, we only deliver within 10 km of our branches.');
          setIsLoading(false);
          return;
        }
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
        toast.error('No results found for the entered address.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Local state for selected address before saving to Redux
  const [localSelectedAddress, setLocalSelectedAddress] = useState(selectedAddress);
  
  // Update setSelectedAddressLocal to check distance
  const setSelectedAddressLocal = (address) => {
    if (!isWithin10Km(address.lat, address.lng)) {
      toast.error('Sorry, we only deliver within 10 km of our branches.');
      setShowSaveOption(false);
      return;
    }
    setLocalSelectedAddress(address);
    setSearchQuery(address.address || '');
    setShowSaveOption(true);
  };
  
  // Update getCurrentLocation to check distance before allowing selection
  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          if (!isWithin10Km(latitude, longitude)) {
            toast.error('Sorry, we only deliver within 10 km of our branches.');
            setIsLoading(false);
            return;
          }
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
                setSelectedAddressLocal(addressObj);
                setSearchQuery(data.display_name); // Ensure input field is updated
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
          toast.error('Unable to get your current location. Please check your browser permissions.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };
  
  // Handle adding address for non-authenticated users - NEW
  const handleAddAddressForGuest = () => {
    if (!localSelectedAddress) return;
    if (!isWithin10Km(localSelectedAddress.lat, localSelectedAddress.lng)) {
      toast.error('Sorry, we only deliver within 10 km of our branches.');
      return;
    }
    
    // For non-authenticated users, just pass the address back to parent
    if (onAddressSelected) {
      onAddressSelected(localSelectedAddress);
    }
  };

  // Save address to saved addresses list and user profile
  const handleSaveAddress = () => {
    if (!localSelectedAddress) return;
    if (!isWithin10Km(localSelectedAddress.lat, localSelectedAddress.lng)) {
      toast.error('Sorry, we only deliver within 10 km of our branches.');
      return;
    }
    // Safely check if address is already saved by ensuring savedAddresses exists
    const addressList = savedAddresses || [];
    const isAlreadySaved = addressList.some(addr => 
      addr && // Check that the address item exists
      Math.abs(addr.lat - localSelectedAddress.lat) < 0.0001 && 
      Math.abs(addr.lng - localSelectedAddress.lng) < 0.0001
    );
    
    if (isAlreadySaved) {
      toast.error('This address is already saved.');
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
              if (onClose) {
                onClose();
              } else {
                setIsModalOpen(false);
                setIsAddressList(false);
              }
              
              // Show success message
              toast.success('Address saved successfully!');
            });
        })
        .catch(error => {
          console.error('Failed to save address:', error);
          // Fallback to local storage if API call fails
          dispatch(addSavedAddress(newAddress));
          dispatch(setSelectedAddress(newAddress));
          
          setShowSaveOption(false);
          setAddressName('');
          if (onClose) {
            onClose();
          } else {
            setIsModalOpen(false);
            setIsAddressList(false);
          }
          
          toast.success('Address saved successfully!');
        });
    } else {
      // Save locally if not authenticated
      dispatch(addSavedAddress(newAddress));
      dispatch(setSelectedAddress(newAddress));
      
      setShowSaveOption(false);
      setAddressName('');
      if (onClose) {
        onClose();
      } else {
        setIsModalOpen(false);
        setIsAddressList(false);
      }
      
      toast.success('Address saved successfully!');
    }
  };
  
  // Delete an address
 const handleDeleteAddress = (addressId) => {
  if (!addressId) return;
  
  openConfirmModal({
    title: 'Delete Address',
    message: 'Are you sure you want to delete this address?',
    onConfirm: () => {
      if (isAuthenticated && userId) {
        // Delete from user's profile in database
        dispatch(deleteUserAddress({ userId, addressId }))
          .unwrap()
          .catch(error => {
            console.error('Failed to delete address:', error);
            toast.error('Failed to delete address. Please try again.');
          });
      } else {
        // Delete locally if not authenticated
        dispatch(removeAddress(addressId));
      }
      closeConfirmModal();
    }
  });
};

  // Select a saved address
  const handleSelectSavedAddress = (address) => {
    if (isAuthenticated && userId) {
      dispatch(setUserSelectedAddress({ userId, address }))
        .unwrap()
        .then(() => {
          if (onClose) {
            onClose();
          } else {
            setIsModalOpen(false);
            setIsAddressList(false);
          }
        })
        .catch(error => {
          console.error('Failed to set selected address:', error);
          // Fallback to local storage
          dispatch(setSelectedAddress(address));
          if (onClose) {
            onClose();
          } else {
            setIsModalOpen(false);
            setIsAddressList(false);
          }
        });
    } else {
      dispatch(setSelectedAddress(address));
      if (onClose) {
        onClose();
      } else {
        setIsModalOpen(false);
        setIsAddressList(false);
      }
    }
  };

  // Helper to check if a location is within 10km of any branch
  function isWithin10Km(lat, lng) {
    if (!branches.length) return true; // fallback: allow if branches not loaded
    return branches.some(branch => {
      const branchLat = branch.latitude || (branch.coordinates && branch.coordinates.lat);
      const branchLng = branch.longitude || (branch.coordinates && branch.coordinates.lng);
      if (typeof branchLat !== 'number' || typeof branchLng !== 'number') return false;
      return getDistanceFromLatLonInKm(lat, lng, branchLat, branchLng) <= 10;
    });
  }

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
  
  // Close modal when clicking outside - only when not used as controlled component
  useEffect(() => {
    if (onClose) return; // Skip click outside when used as controlled component
    
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
  }, [onClose]);

  // Listen for global open modal event - only when not used as controlled component
  useEffect(() => {
    if (onClose) return; // Skip event listener when used as controlled component
    
    const openModal = (e) => {
      setIsModalOpen(true);
      // If event has detail.showSaved, open saved addresses list; otherwise, open map entry
      if (e && e.detail && typeof e.detail.showSaved === 'boolean') {
        setIsAddressList(!!e.detail.showSaved);
      } else {
        setIsAddressList(true);
      }
    };
    window.addEventListener('open-address-selector-modal', openModal);
    return () => window.removeEventListener('open-address-selector-modal', openModal);
  }, [onClose]);

  return (
    <>
      {/* Address Button in Navbar - only show when not used as controlled component */}
      {!onClose && (
        <button
          onClick={() => { setIsModalOpen(true); setIsAddressList(true); }}
          data-testid="address-selector-btn"
          className="flex items-center text-text cursor-pointer mr-4 hover:text-accent transition-colors"
        >
          <FaMapMarkerAlt className="mr-1" />
          <span className="hidden sm:inline-block max-w-[150px] overflow-hidden truncate">
            {selectedAddress ? (selectedAddress.name || selectedAddress.address.split(',')[0]) : 'Select Address'}
          </span>
        </button>
      )}

      {/* Modal Overlay - show when modal is open or when used as controlled component */}
      {(isModalOpen || onClose) && (
        <div className="fixed inset-0 bg-modal/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-background rounded-lg w-full max-w-xl shadow-xl max-h-[90vh] flex flex-col"
          >
            {/* Modal Header - Fixed at the top */}
            <div className="flex justify-between items-center p-4 border-b border-text/10 sticky top-0 bg-background z-10">
              <h2 className="text-2xl font-bold text-text">
                {isAddressList ? 'Your Saved Addresses' : 'Enter Address'}
              </h2>
              <div className="flex items-center space-x-3">
                {/* Only allow toggling to saved addresses if authenticated */}
                {isAuthenticated && !forceMapView && (
                  <button
                    onClick={toggleAddressList}
                    className="text-primary cursor-pointer hover:text-primary/80"
                    title={isAddressList ? "Find New Address" : "View Saved Addresses"}
                  >
                    {isAddressList ? <FaMapMarkerAlt size={20} /> : <FaList size={20} />}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    } else {
                      setIsModalOpen(false);
                      setIsAddressList(false);
                    }
                  }}
                  className="text-text/50 cursor-pointer hover:text-accent"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1">
              {/* Loading Indicator for API calls */}
              {locationStatus === 'loading' && (
                <div className="fixed inset-0 bg-text/20 z-50 flex items-center justify-center">
                  <div className="bg-background p-6 rounded-lg shadow-xl flex items-center">
                    <FaSpinner className="text-primary text-2xl animate-spin mr-3" />
                    <span>Processing...</span>
                  </div>
                </div>
              )}

              {/* Only show saved addresses list if authenticated and not forced to map view, otherwise always show map entry */}
              {isAddressList && isAuthenticated && !forceMapView ? (
                /* Saved Addresses List */
                <div className="p-4">
                  {savedAddresses && savedAddresses.length > 0 ? (
                    <>
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
                              className="text-accent cursor-pointer hover:text-red-600 p-2"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* Add New Address button always at the end */}
                      <div className="text-center mt-6">
                        <button
                          onClick={() => setIsAddressList(false)}
                          className="bg-primary text-background px-6 py-3 rounded-lg font-medium"
                        >
                          Add New Address
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-text/30" />
                      <p className="text-lg font-medium mb-2">No saved addresses</p>
                      <p className="text-text/50 mb-4">You haven't saved any addresses yet.</p>
                      <button
                        onClick={() => setIsAddressList(false)}
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
                  {/* Use Current Location Button - now styled as a small link/button for better UI/UX */}
                  <div className="px-4 pt-4 flex justify-end">
                    <button
                      onClick={getCurrentLocation}
                      className="inline-flex items-center text-primary text-sm font-medium hover:underline hover:text-accent bg-transparent p-0 m-0 border-0 shadow-none focus:outline-none"
                      style={{ background: 'none', boxShadow: 'none' }}
                    >
                      <FaMapMarkerAlt className="mr-1 text-base" />
                      Use Current Location
                    </button>
                  </div>

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
                        className="w-full p-3 pl-10 pr-20 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-full  truncate"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-12 text-text/50 cursor-pointer hover:text-accent"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button 
                        onClick={handleSearch} 
                        className="absolute right-3 text-accent cursor-pointer hover:text-accent/80"
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
                          <FaMapMarkerAlt className="text-secondary" />
                        </div>
                        <div className="flex-1 overflow-hidden pr-2">
                          <p className="font-medium text-text truncate">{localSelectedAddress.address}</p>
                        </div>
                      </div>

                      {/* Add Address button for non-authenticated users - NEW */}
                      {!isAuthenticated && onAddressSelected && (
                        <button
                          className="w-full bg-accent text-secondary py-2 rounded-lg font-medium hover:bg-accent/90 mb-2"
                          onClick={handleAddAddressForGuest}
                        >
                          Add Address
                        </button>
                      )}

                      {/* Show 'Select this location' button for guests only when not used in checkout */}
                      {!isAuthenticated && !onAddressSelected && (
                        <button
                          className="w-full bg-primary text-secondary py-2 rounded-lg font-medium hover:bg-primary/90 mb-2"
                          onClick={() => {
                            dispatch(setSelectedAddress(localSelectedAddress));
                            if (onClose) {
                              onClose();
                            } else {
                              setIsModalOpen(false);
                              setIsAddressList(false);
                            }
                          }}
                        >
                          Select this location
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Save Address Option - only for authenticated users */}
                  {isAuthenticated && showSaveOption && localSelectedAddress && (
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
                          className="w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50 rounded-lg  mb-3"
                        />
                        <button
                          onClick={handleSaveAddress}
                          className="w-full bg-accent text-secondary cursor-pointer py-2 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!addressName.trim()}
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
};

export default AddressSelector;