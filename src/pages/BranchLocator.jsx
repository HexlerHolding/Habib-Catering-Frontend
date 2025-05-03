import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const dropdownRef = useRef(null);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersLayerRef = useRef(null);
  
  // City coordinates data
  const cityCoordinates = {
    'Lahore': { lat: 31.5204, lng: 74.3587 },
    'Islamabad': { lat: 33.6844, lng: 73.0479 },
    'Karachi': { lat: 24.8607, lng: 67.0011 },
    'Rawalpindi': { lat: 33.5651, lng: 73.0169 },
    'Faisalabad': { lat: 31.4504, lng: 73.1350 },
    'Multan': { lat: 30.1798, lng: 71.4214 },
    'Peshawar': { lat: 34.0151, lng: 71.5249 },
    'Quetta': { lat: 30.1798, lng: 66.9750 },
    'Sialkot': { lat: 32.4945, lng: 74.5229 },
    'Gujranwala': { lat: 32.1877, lng: 74.1945 },
    'Hyderabad': { lat: 25.3960, lng: 68.3578 },
    'Bahawalpur': { lat: 29.3956, lng: 71.6722 },
    'Sargodha': { lat: 32.0740, lng: 72.6861 },
    'Sukkur': { lat: 27.7052, lng: 68.8570 },
    'Larkana': { lat: 27.5598, lng: 68.2264 }
  };
  
  // Sample branch data - expanded with more locations
  const branches = [
    {
      id: 1,
      name: 'Pine Avenue',
      address: '96VX+PCQ, Pine Ave, Wocland Villas Block N Valencia, Lahore, Pakistan',
      city: 'Lahore'
    },
    {
      id: 2,
      name: 'Bahria Civic Center',
      address: 'Civic center Flat A-1, Al-Bahrain Complex, Block A, Civic Center Bahria Town, Islamabad, Punjab 46220, Pakistan',
      city: 'Islamabad'
    },
    {
      id: 3,
      name: 'Allama Iqbal Town',
      address: '6-D, Main Boulevard Allama Iqbal Town, Huma Block Allama Iqbal Town, Lahore, Punjab 54000, Pakistan',
      city: 'Lahore'
    },
    {
      id: 4,
      name: 'Clifton Branch',
      address: 'Plot 5-C, Block 5, Clifton, Karachi, Sindh 75600, Pakistan',
      city: 'Karachi'
    },
    {
      id: 5,
      name: 'Saddar Town',
      address: '239 Shahrah-e-Liaquat, Saddar, Karachi, Sindh 74000, Pakistan',
      city: 'Karachi'
    },
    {
      id: 6,
      name: 'Blue Area',
      address: 'F-6 Blue Area, Jinnah Avenue, Islamabad, 44000, Pakistan',
      city: 'Islamabad'
    },
    {
      id: 7,
      name: 'Commercial Market',
      address: 'Shop No. 14, Commercial Market, Satellite Town, Rawalpindi, Punjab, Pakistan',
      city: 'Rawalpindi'
    },
    {
      id: 8,
      name: 'D Ground',
      address: 'D Ground, Peoples Colony No 1, Faisalabad, Punjab 38000, Pakistan',
      city: 'Faisalabad'
    },
    {
      id: 9,
      name: 'Gulgasht Colony',
      address: 'Gulgasht Colony, Northern Bypass Road, Multan, Punjab, Pakistan',
      city: 'Multan'
    },
    {
      id: 10,
      name: 'University Road',
      address: 'University Road, Near Board of Intermediate Education, Peshawar, KPK, Pakistan',
      city: 'Peshawar'
    },
    {
      id: 11,
      name: 'Jinnah Road',
      address: 'Jinnah Road, Near Balochistan University, Quetta, Pakistan',
      city: 'Quetta'
    },
    {
      id: 12,
      name: 'Paris Road',
      address: 'Paris Road, Sialkot Cantt, Sialkot, Punjab, Pakistan',
      city: 'Sialkot'
    },
    {
      id: 13,
      name: 'G.T. Road',
      address: 'G.T. Road, Near WAPDA House, Gujranwala, Punjab, Pakistan',
      city: 'Gujranwala'
    },
    {
      id: 14,
      name: 'Latifabad',
      address: 'Latifabad Unit No. 7, Hyderabad, Sindh, Pakistan',
      city: 'Hyderabad'
    },
    {
      id: 15,
      name: 'Model Town',
      address: 'Model Town A, Bahawalpur, Punjab, Pakistan',
      city: 'Bahawalpur'
    },
    {
      id: 16,
      name: 'Satellite Town',
      address: 'Block C, Satellite Town, Sargodha, Punjab, Pakistan',
      city: 'Sargodha'
    },
    {
      id: 17,
      name: 'Barrage Road',
      address: 'Barrage Road, Near Military Ground, Sukkur, Sindh, Pakistan',
      city: 'Sukkur'
    },
    {
      id: 18,
      name: 'VIP Road',
      address: 'VIP Road, Near Chandka Medical College, Larkana, Sindh, Pakistan',
      city: 'Larkana'
    },
    {
      id: 19,
      name: 'DHA Phase 5',
      address: 'Y Block, DHA Phase 5, Lahore, Punjab, Pakistan',
      city: 'Lahore'
    },
    {
      id: 20,
      name: 'Gulberg',
      address: 'Main Boulevard Gulberg, Lahore, Punjab, Pakistan',
      city: 'Lahore'
    }
  ];
  
  // Get coordinates for each branch based on its city
  const branchesWithCoordinates = branches.map(branch => ({
    ...branch,
    coordinates: cityCoordinates[branch.city] || { lat: 30.3753, lng: 69.3451 } // Default to Pakistan center if not found
  }));
  
  // Expanded cities data
  const cities = [
    'Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
    'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
  ];
  
  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Initialize map with Pakistan center
      leafletMap.current = L.map(mapRef.current).setView([30.3753, 69.3451], 5);
      
      // Add tile layer with English labels
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMap.current);
      
      // Create a layer for markers
      markersLayerRef.current = L.layerGroup().addTo(leafletMap.current);
      
      // Add markers for all branches
      addBranchMarkers();
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);
  
  // Update markers when selected city changes
  useEffect(() => {
    if (leafletMap.current) {
      addBranchMarkers();
      
      if (selectedCity && cityCoordinates[selectedCity]) {
        const { lat, lng } = cityCoordinates[selectedCity];
        leafletMap.current.setView([lat, lng], 12);
      } else {
        // If no city selected, show all of Pakistan
        leafletMap.current.setView([30.3753, 69.3451], 5);
      }
    }
  }, [selectedCity]);
  
  // Function to add branch markers to map
  const addBranchMarkers = () => {
    if (!markersLayerRef.current) return;
    
    // Clear existing markers
    markersLayerRef.current.clearLayers();
    
    // Filter branches based on selected city
    const branchesToShow = selectedCity 
      ? branchesWithCoordinates.filter(branch => branch.city === selectedCity)
      : branchesWithCoordinates;
    
    // Add markers for each branch
    branchesToShow.forEach(branch => {
      const { lat, lng } = branch.coordinates;
      const marker = L.marker([lat, lng])
        .bindPopup(`<b>${branch.name}</b><br>${branch.address}`);
      
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
  
  // Filter branches based on selected city and search query
  const filteredBranches = branches.filter(branch => {
    const matchesCity = !selectedCity || branch.city === selectedCity;
    const matchesSearch = !searchQuery || 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      branch.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button and Header */}
      <div className="mb-6">
        <div className="flex items-center">
          <Link to='/menu' className="mr-4 text-gray-700">
            <FaArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Branch Locator</h1>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="block w-full pl-3 pr-10 py-3 text-left text-base border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 rounded-md bg-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCity || "Select City"}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="h-5 w-5" />
              </div>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-y-auto focus:outline-none">
                <div 
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
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
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
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
              className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
              placeholder="Search Branch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Branch Listings and Map Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[27rem]">
        {/* Branch Listings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-full overflow-y-auto" style={{ maxHeight: '600px' }}>
            {filteredBranches.map((branch) => (
              <div key={branch.id} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{branch.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{branch.address}</p>
                      <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredBranches.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                No branches found matching your criteria.
              </div>
            )}
          </div>
        </div>
        
        {/* Map Container */}
        <div className="bg-gray-100 rounded-lg h-96 md:h-full overflow-hidden">
          <div ref={mapRef} className="h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BranchLocator;