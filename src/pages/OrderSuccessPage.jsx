import React, { useEffect } from 'react';
import { FaCheckCircle, FaClipboard, FaHome } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-secondary rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-text font-poppins">Order Successful!</h1>
        
        <p className="text-text/70 mb-6 font-montserrat">
          Thank you for your order. We've received your order and will begin processing it right away.
        </p>
        
        <div className="bg-background rounded-lg p-6 mb-8 border border-primary/20">
          <h2 className="text-lg font-bold mb-4 text-text font-poppins">Order Details</h2>
          
          <div className="flex justify-between mb-2">
            <span className="text-text/70 font-montserrat">Order ID:</span>
            <span className="font-medium text-text font-montserrat">{orderId}</span>
          </div>
          
          {orderDetails && (
            <>
              <div className="flex justify-between mb-2">
                <span className="text-text/70 font-montserrat">Date:</span>
                <span className="font-medium text-text font-montserrat">{formatDate(orderDetails.orderTime)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-text/70 font-montserrat">Items:</span>
                <span className="font-medium text-text font-montserrat">{orderDetails.items}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-text/70 font-montserrat">Subtotal:</span>
                <span className="font-medium text-text font-montserrat">Rs. {orderDetails.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-text/70 font-montserrat">Tax:</span>
                <span className="font-medium text-text font-montserrat">Rs. {orderDetails.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span className="text-text font-poppins">Total:</span>
                <span className="text-text font-poppins">Rs. {orderDetails.total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <Link 
            to="/"
            className="bg-primary text-text py-3 px-6 rounded-lg font-bold hover:bg-primary/80 transition flex-1 flex items-center justify-center font-poppins"
          >
            <FaHome className="mr-2" /> Return Home
          </Link>
          
          <Link 
            to="/menu"
            className="bg-accent text-secondary py-3 px-6 rounded-lg font-bold hover:bg-accent/80 transition flex-1 flex items-center justify-center font-poppins"
          >
            <FaClipboard className="mr-2" /> Order Again
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-text/50 text-sm max-w-md text-center font-montserrat">
        A confirmation email has been sent to your email address. If you have any questions, please contact our customer service.
      </p>
    </div>
  );
};

export default OrderSuccessPage;