import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaMapMarkerAlt, FaPencilAlt, FaTrash, FaCheck } from 'react-icons/fa';
import { selectIsAuthenticated } from '../../redux/slices/authSlice';
import { 
  selectSavedAddresses, 
  selectSelectedAddress, 
  setSelectedAddress, 
  removeAddress,
  updateAddressName
} from '../../redux/slices/locationSlice';
import ConfirmationModal from '../../components/ConfirmationModal';

const SavedAddressesPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const savedAddresses = useSelector(selectSavedAddresses) || []; // Ensure it's never undefined
  const selectedAddress = useSelector(selectSelectedAddress);
  
  // State for editing address name
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  // State for confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    console.log("SavedAddressesPage mounted - Auth state:", isAuthenticated);
  }, [isAuthenticated]);
  
  // Handle setting an address as default
  const handleSetDefault = (address) => {
    dispatch(setSelectedAddress(address));
    // Scroll to top to show confirmation message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle deleting an address (show confirmation modal)
  const handleDeleteAddress = (addressId) => {
    setConfirmModal({
      open: true,
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address?',
      onConfirm: () => {
        dispatch(removeAddress(addressId));
        setConfirmModal({ ...confirmModal, open: false });
      }
    });
  };

  // Helper to close modal
  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, open: false });
  };
  
  // Handle editing address name
  const startEditing = (address) => {
    setEditingId(address.id);
    setEditName(address.name || '');
  };
  
  // Save edited address name
  const saveAddressName = (addressId) => {
    if (editName.trim()) {
      dispatch(updateAddressName({ id: addressId, name: editName.trim() }));
    }
    setEditingId(null);
  };
  
  // Cancels editing
  const cancelEditing = () => {
    setEditingId(null);
  };
  
  // Handle key press events in the name input
  const handleKeyDown = (e, addressId) => {
    if (e.key === 'Enter') {
      saveAddressName(addressId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <a 
          href="#address-selector" 
          onClick={(e) => {
            e.preventDefault();
            // Find and click the address selector button in the navbar
            const addressSelectorBtn = document.querySelector('[data-testid="address-selector-btn"]');
            if (addressSelectorBtn) addressSelectorBtn.click();
          }}
          className="flex items-center bg-primary text-text px-4 py-2 rounded-lg hover:bg-primary/80 hover:brightness-105 transition-colors"
        >
          <FaMapMarkerAlt className="mr-2" /> Add New Address
        </a>
      </div>
      
      {selectedAddress && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
          <p className="font-medium">Your current delivery address is:</p>
          <p className="text-sm">{selectedAddress.address}</p>
        </div>
      )}
      
      {savedAddresses && savedAddresses.length > 0 ? (
        <div className="space-y-4">
          {savedAddresses.map((address) => (
            <div 
              key={address.id} 
              className={`border rounded-lg p-4 transition-colors ${
                selectedAddress && selectedAddress.id === address.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-text/10 hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {editingId === address.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, address.id)}
                        autoFocus
                        className="font-medium text-lg border-b border-primary outline-none bg-transparent"
                        placeholder="Location name (e.g. Home, Office)"
                      />
                    ) : (
                      <span className="font-medium text-lg">
                        {address.name || 'Unnamed Location'}
                      </span>
                    )}
                    {selectedAddress && selectedAddress.id === address.id && (
                      <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-text/70 mt-1">
                    <FaMapMarkerAlt className="inline-block mr-1 text-primary" />
                    {address.address}
                  </p>
                </div>
                <div className="flex space-x-2 items-start ml-4">
                  {editingId === address.id ? (
                    <>
                      <button 
                        onClick={() => saveAddressName(address.id)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-text/5"
                        title="Save name"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-text/5"
                        title="Cancel"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <>
                      {(!selectedAddress || selectedAddress.id !== address.id) && (
                        <button 
                          onClick={() => handleSetDefault(address)}
                          className="text-accent hover:text-accent/80 p-2 rounded-full hover:bg-text/5"
                          title="Set as default"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => startEditing(address)}
                        className="text-text/70 hover:text-primary p-2 rounded-full hover:bg-text/5"
                        title="Edit name"
                      >
                        <FaPencilAlt />
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-text/70 hover:text-red-500 p-2 rounded-full hover:bg-text/5"
                        title="Delete address"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-text/20 rounded-lg">
          <FaMapMarkerAlt className="mx-auto text-4xl text-text/30 mb-3" />
          <p className="text-text/50 mb-4">You don't have any saved addresses yet.</p>
          <button
            onClick={() => {
              // Find and click the address selector button in the navbar
              const addressSelectorBtn = document.querySelector('[data-testid="address-selector-btn"]');
              if (addressSelectorBtn) addressSelectorBtn.click();
            }}
            className="bg-primary text-text px-6 py-2 rounded-lg font-medium hover:bg-primary/80 hover:brightness-105 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default SavedAddressesPage;
