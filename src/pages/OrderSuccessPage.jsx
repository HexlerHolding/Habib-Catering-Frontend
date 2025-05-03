import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { FaCheckCircle, FaHome, FaList } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get order ID from location state
  const { orderId } = location.state || { orderId: 'ORD-' + Date.now() };
  
  // Clear cart when order is successfully placed
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <FaCheckCircle className="mx-auto text-6xl text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Order Successfully Placed!</h1>
        
        <p className="text-gray-700 mb-6">
          Thank you for your order. We've received your order and will begin processing it right away.
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Order Reference</p>
          <p className="text-xl font-bold">{orderId}</p>
        </div>
        
        <p className="text-gray-600 mb-8">
          A confirmation has been sent to your email address.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center py-3 px-4 rounded border border-gray-300 hover:bg-gray-100 font-medium transition-colors"
          >
            <FaHome className="mr-2" /> Home
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center justify-center py-3 px-4 rounded bg-primary hover:bg-primary/90 font-medium transition-colors"
          >
            <FaList className="mr-2" /> Order Again
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <h2 className="font-bold text-lg mb-2">What happens next?</h2>
        <ol className="text-left space-y-4 mt-4">
          <li className="flex">
            <div className="bg-primary text-text h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
            <div>
              <p className="font-medium">Order Preparation</p>
              <p className="text-sm text-gray-600">Our chefs are preparing your delicious food</p>
            </div>
          </li>
          <li className="flex">
            <div className="bg-primary text-text h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
            <div>
              <p className="font-medium">Delivery</p>
              <p className="text-sm text-gray-600">Your order will be on its way to you soon</p>
            </div>
          </li>
          <li className="flex">
            <div className="bg-primary text-text h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
            <div>
              <p className="font-medium">Enjoy!</p>
              <p className="text-sm text-gray-600">Time to enjoy your meal!</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
