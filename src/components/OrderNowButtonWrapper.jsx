import React from 'react';
import { useLocation } from 'react-router-dom';
import OrderNowButton from './OrderNowButton';

const OrderNowButtonWrapper = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show button on login-related pages
  const loginPages = ['/login', '/login/phone-number', '/login/otp'];
  
  if (loginPages.includes(path)) {
    return null;
  }
  
  return <OrderNowButton />;
};

export default OrderNowButtonWrapper;
