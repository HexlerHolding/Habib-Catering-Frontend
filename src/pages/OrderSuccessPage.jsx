import { useEffect } from 'react';
import { FaCheckCircle, FaClipboard, FaHome, FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../data/globalText';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract order details from location state
  const { orderId, orderDetails } = location.state || {};
  
  // Redirect to home if no order details are present
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  // If no order details, show loading
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2 sm:p-4 mt-4 sm:mt-9">
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-4 sm:p-8 text-center overflow-x-auto">
      {/* Go Back Arrow */}
      <button
        className="flex items-center text-primary cursor-pointer hover:text-accent font-medium mb-4 px-2 py-1 rounded transition-colors self-start"
        onClick={() => navigate('/')}
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>
        <div className="mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-text font-poppins">Order Successful!</h1>
        <p className="text-text/70 mb-6 font-montserrat text-sm sm:text-base">
          Thank you for your order. We've received your order and will begin processing it right away.
        </p>
        <div className="bg-background rounded-lg p-3 sm:p-6 mb-8 border border-primary/20 overflow-x-auto">
          <h2 className="text-base sm:text-lg font-bold mb-4 text-text font-poppins">Order Details</h2>
          <div className="flex flex-col gap-2 text-left text-xs sm:text-sm">
            <div className="flex flex-wrap justify-between mb-2">
              <span className="text-text/70 font-montserrat">Order ID:</span>
              <span className="font-medium text-text font-montserrat break-all">{orderId}</span>
            </div>
            {orderDetails && (
              <>
                <div className="flex flex-wrap justify-between mb-2">
                  <span className="text-text/70 font-montserrat">Date:</span>
                  <span className="font-medium text-text font-montserrat">{formatDate(orderDetails.orderTime)}</span>
                </div>
                <div className="flex flex-wrap justify-between mb-2">
                  <span className="text-text/70 font-montserrat">Items:</span>
                  <span className="font-medium text-text font-montserrat">{orderDetails.items}</span>
                </div>
                <div className="flex flex-wrap justify-between mb-2">
                  <span className="text-text/70 font-montserrat">Subtotal:</span>
                  <span className="font-medium text-text font-montserrat">{CURRENCY_SYMBOL} {orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap justify-between mb-2">
                  <span className="text-text/70 font-montserrat">Tax:</span>
                  <span className="font-medium text-text font-montserrat">{CURRENCY_SYMBOL} {orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap justify-between font-bold">
                  <span className="text-text font-poppins">Total:</span>
                  <span className="text-text font-poppins">{CURRENCY_SYMBOL} {orderDetails.total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full">
          <Link 
            to="/"
            className="bg-primary text-secondary py-3 px-4 sm:px-6 rounded-lg font-bold hover:bg-primary/80 transition flex-1 flex items-center justify-center font-poppins text-sm sm:text-base"
          >
            <FaHome className="mr-2" /> Return Home
          </Link>
          <Link 
            to="/menu"
            className="bg-accent text-secondary py-3 px-4 sm:px-6 rounded-lg font-bold hover:bg-accent/80 transition flex-1 flex items-center justify-center font-poppins text-sm sm:text-base"
          >
            <FaClipboard className="mr-2" /> Order Again
          </Link>
        </div>
      </div>
      <p className="mt-6 sm:mt-8 text-text/50 text-xs sm:text-sm max-w-md text-center font-montserrat">
        A confirmation email has been sent to your email address. If you have any questions, please contact our customer service.
      </p>
    </div>
  );
};

export default OrderSuccessPage;