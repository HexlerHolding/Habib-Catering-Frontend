import React, { useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const CardDetailsModal = ({ isOpen, onClose, onSave }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length && i < 16; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    }
    
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const handleCardDataChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setCardData({
        ...cardData,
        [name]: formatCardNumber(value)
      });
    } else if (name === 'expiry') {
      setCardData({
        ...cardData,
        [name]: formatExpiry(value)
      });
    } else if (name === 'cvv') {
      const cvvDigits = value.replace(/\D/g, '');
      if (cvvDigits.length <= 4) {
        setCardData({
          ...cardData,
          [name]: cvvDigits
        });
      }
    } else {
      setCardData({
        ...cardData,
        [name]: value
      });
    }
    
    if (cardErrors[name]) {
      setCardErrors({
        ...cardErrors,
        [name]: null
      });
    }
  };

  const validateCardData = () => {
    const newErrors = {};
    const cardNumberDigits = cardData.cardNumber.replace(/\D/g, '');
    const expiryDigits = cardData.expiry.replace(/\D/g, '');
    
    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }
    
    if (cardNumberDigits.length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (expiryDigits.length < 4) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const month = parseInt(expiryDigits.substring(0, 2), 10);
      const year = parseInt(`20${expiryDigits.substring(2, 4)}`, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }
    
    if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV/CVC code';
    }
    
    return newErrors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const validationErrors = validateCardData();
    if (Object.keys(validationErrors).length > 0) {
      setCardErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);
    
    // Simulate saving card data
    setTimeout(() => {
      onSave(cardData);
      setIsSaving(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-modal/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 border border-primary/20">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-text font-poppins">Enter Card Details</h3>
            <button 
              onClick={onClose} 
              className="text-text/70 cursor-pointer hover:text-text"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave}>
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardDataChange}
                  maxLength={19} // 16 digits + 3 spaces
                  className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${cardErrors.cardNumber ? 'border-accent' : 'border-text/20'}`}
                  placeholder="0000 0000 0000 0000"
                />
                {cardErrors.cardNumber && (
                  <p className="text-accent text-sm mt-1 font-montserrat">{cardErrors.cardNumber}</p>
                )}
              </div>
              
              {/* Card Holder */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={cardData.cardHolder}
                  onChange={handleCardDataChange}
                  className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${cardErrors.cardHolder ? 'border-accent' : 'border-text/20'}`}
                  placeholder="John Doe"
                />
                {cardErrors.cardHolder && (
                  <p className="text-accent text-sm mt-1 font-montserrat">{cardErrors.cardHolder}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardDataChange}
                    maxLength={5} // MM/YY format
                    className={`w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50  rounded-md ${cardErrors.expiry ? 'border-accent' : 'border-text/20'}`}
                    placeholder="MM/YY"
                  />
                  {cardErrors.expiry && (
                    <p className="text-accent text-sm mt-1 font-montserrat">{cardErrors.expiry}</p>
                  )}
                </div>
                
                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                    CVV/CVC *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardDataChange}
                    maxLength={4}
                    className={`w-full p-3 borfocus:outline-text focus:outline-2 outline-1 outline-text/50 der rounded-md ${cardErrors.cvv ? 'border-accent' : 'border-text/20'}`}
                    placeholder="123"
                  />
                  {cardErrors.cvv && (
                    <p className="text-accent text-sm mt-1 font-montserrat">{cardErrors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-text/20 rounded-md text-text font-medium hover:bg-text/10 transition-colors font-montserrat"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 px-4 bg-primary text-secondary rounded-md font-medium hover:bg-primary/80 hover:brightness-105 transition-colors font-poppins flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-text/30 border-t-text/80 rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Card'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="p-4 bg-primary/10 rounded-b-lg border-t border-primary/20">
          <div className="flex items-center">
            <div className="text-primary">
              <AiOutlineInfoCircle className="w-6 h-6" />
            </div>
            <p className="ml-2 text-sm text-text/70 font-montserrat">
              Your card information is securely processed and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;
