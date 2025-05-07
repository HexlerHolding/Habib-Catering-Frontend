// src/components/SelectedAddressDisplay.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { selectSelectedAddress } from '../redux/slices/locationSlice';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const SelectedAddressDisplay = () => {
  const selectedAddress = useSelector(selectSelectedAddress);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Don't render if not authenticated or no address selected
  if (!isAuthenticated || !selectedAddress) return null;

  return (
    <div className="bg-text/5 rounded-lg p-3 mb-4 flex items-start">
      <div className="bg-primary p-2 rounded-full mr-3">
        <FaMapMarkerAlt className="text-text" />
      </div>
      <div>
        <p className="font-medium text-text">Delivering to</p>
        <p className="text-text/70 text-sm">{selectedAddress.address}</p>
      </div>
    </div>
  );
};

export default SelectedAddressDisplay;