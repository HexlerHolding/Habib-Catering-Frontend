// src/components/CardDetailsModal.js
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const CardDetailsModal = ({ isOpen, onClose, onSave, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [cardComplete, setCardComplete] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardBrand, setCardBrand] = useState(null);
  const [lastFour, setLastFour] = useState(null);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCardComplete(false);
      setCardHolder('');
      setError(null);
      setProcessing(false);
    }
  }, [isOpen]);

  // Handle card element change event
  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : null);
    
    if (event.brand) {
      setCardBrand(event.brand);
    }
    
    if (event.value && event.value.postalCode) {
      setLastFour(event.value.postalCode);
    }
  };

  // Handle cardholder name change
  const handleCardHolderChange = (e) => {
    setCardHolder(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    if (!cardComplete || !cardHolder.trim()) {
      setError('Please complete all required fields');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Get card details
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardHolder,
        },
      });
      
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }
      
      // For the checkout implementation
      const cardData = {
        cardHolder: cardHolder,
        cardNumber: `•••• •••• •••• ${paymentMethod.card.last4}`,
        expiry: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year.toString().slice(-2)}`,
        cvv: '•••',
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        paymentMethodId: paymentMethod.id,
      };
      
      // Pass the payment method to the parent component
      onSave(cardData);
      setProcessing(false);
    } catch (err) {
      console.error("Error processing card:", err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  // Style for the Stripe CardElement
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#30313d',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#df1b41',
        iconColor: '#df1b41',
      },
    },
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
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Card Holder */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={handleCardHolderChange}
                  className="w-full p-3 focus:outline-text focus:outline-2 outline-1 outline-text/50 rounded-md border-text/20"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              {/* Stripe Card Element */}
              <div>
                <label className="block text-sm font-medium mb-1 text-text font-montserrat">
                  Card Information *
                </label>
                <div className="w-full p-3 border border-text/20 rounded-md bg-white focus-within:outline-text focus-within:outline-2 focus-within:outline-1 focus-within:outline-text/50">
                  <CardElement options={cardElementOptions} onChange={handleCardChange} />
                </div>
                {error && (
                  <p className="text-accent text-sm mt-1 font-montserrat">{error}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-text/20 rounded-md text-text font-medium hover:bg-text/10 transition-colors font-montserrat"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stripe || !elements || !cardComplete || processing}
                className="py-2 px-4 bg-primary text-secondary rounded-md font-medium hover:bg-primary/80 hover:brightness-105 transition-colors font-poppins flex items-center"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-text/30 border-t-text/80 rounded-full animate-spin mr-2"></div>
                    Processing...
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
              Your payment is securely processed by Stripe. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;