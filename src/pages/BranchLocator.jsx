import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import branchService from '../../Services/branchService';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const BranchLocator = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [branches, setBranches] = useState([]); // State for branches from API
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayerRef = useRef(null);
  const navigate = useNavigate();

  // Extract unique cities from branches data
  const cities = [...new Set(branches.map(branch => branch.city))].sort();

  // Fetch branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const branchData = await branchService.getBranches();
        setBranches(branchData);
      } catch (error) {
        console.error('Failed to load branches:', error);
        setBranches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([30.3753, 69.3451], 5);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMap.current);
      
      markersLayerRef.current = L.layerGroup().addTo(leafletMap.current);
      
      addBranchMarkers();
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when branches, selected city, or search query changes
  useEffect(() => {
    if (leafletMap.current) {
      addBranchMarkers();
      
      if (selectedCity) {
        const cityBranch = branches.find(branch => 
          branch.city === selectedCity && 
          branch.coordinates && 
          branch.coordinates.lat && 
          branch.coordinates.lng
        );
        
        if (cityBranch) {
          leafletMap.current.setView(
            [cityBranch.coordinates.lat, cityBranch.coordinates.lng], 
            12
          );
        }
      } else {
        leafletMap.current.setView([30.3753, 69.3451], 5);
      }
    }
  }, [branches, selectedCity, searchQuery]);

  // Function to add branch markers to map
  const addBranchMarkers = () => {
    if (!markersLayerRef.current) return;
    
    markersLayerRef.current.clearLayers();
    
    const filteredBranches = branches.filter(branch => {
      const matchesCity = !selectedCity || branch.city === selectedCity;
      const matchesSearch = !searchQuery || 
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        branch.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
    
    filteredBranches.forEach(branch => {
      // Skip branches without valid coordinates
      if (!branch.coordinates || !branch.coordinates.lat || !branch.coordinates.lng) {
        console.warn(`Branch ${branch.id} - ${branch.name} has invalid coordinates:`, branch.coordinates);
        return;
      }
      
      const { lat, lng } = branch.coordinates;
      
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${branch.name}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 8px;">${branch.address}</p>
          <button 
            onclick="window.location.href='/branches/${branch.id}'"
            style="background-color: #E6B91E; color: #fff; border: none; padding: 5px 10px; 
            border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;"
          >
            VIEW DETAILS
          </button>
        </div>
      `;
      
      const marker = L.marker([lat, lng])
        .bindPopup(popupContent);
      
      markersLayerRef.current.addLayer(marker);
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Filter branches for display
  const filteredBranches = branches.filter(branch => {
    const matchesCity = !selectedCity || branch.city === selectedCity;
    const matchesSearch = !searchQuery || 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      branch.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Navigate to branch detail page
  const handleViewDetails = (branchId) => {
    navigate(`/branches/${branchId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button and Header */}
      <div className="mb-6">
        <div className="flex items-center">
          <Link to='/menu' className="mr-4 text-text/80">
            <FaArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-text hover:underline">Branch Locator</h1>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="block w-full pl-3 pr-10 py-3 text-left text-base border border-text/20 focus:outline-none focus:ring-primary focus:border-primary rounded-md bg-background"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCity || "Select City"}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text/20">
                <FaChevronDown className="h-5 w-5" />
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-background shadow-lg max-h-60 rounded-md py-1 text-base overflow-y-auto focus:outline-none">
                <div 
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-text/5"
                  onClick={() => {
                    setSelectedCity('');
                    setIsDropdownOpen(false);
                  }}
                >
                  All Cities
                </div>
                {cities.map((city) => (
                  <div
                    key={city}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-text/5"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-3 pr-10 py-3 text-base border border-text/20 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              placeholder="Search Branch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <FaSearch className="h-5 w-5 text-text/20" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Branch Listings and Map Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch Listings */}
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <div className="overflow-y-auto h-[27rem]">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-text/50">
                Loading branches...
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="px-4 py-6 text-center text-text/50">
                No branches found matching your criteria.
              </div>
            ) : (
              filteredBranches.map((branch) => (
                <div key={branch.id} className="border-b border-text/20 last:border-b-0">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <FaMapMarkerAlt className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-text/80">{branch.name}</h3>
                        <p className="mt-1 text-sm text-text/70">{branch.address}</p>
                        <button 
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-text bg-primary hover:bg-primary/80 hover:brightness-105 transition duration-300"
                          onClick={() => handleViewDetails(branch.id)}
                        >
                          VIEW DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Map Container */}
        <div className="bg-text/30 rounded-lg h-96 md:h-full overflow-hidden z-10">
          <div ref={mapRef} className="h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BranchLocator;