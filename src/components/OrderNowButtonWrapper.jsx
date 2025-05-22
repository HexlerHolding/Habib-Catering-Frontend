import React from 'react';
import { useLocation } from 'react-router-dom';
import OrderNowButton from './OrderNowButton';

const OrderNowButtonWrapper = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show button on login-related pages or the menu page
  const hiddenPages = ['/login', '/login/phone-number', '/login/otp', '/menu'];
  
  if (hiddenPages.includes(path)) {
    return null;
  }
  
  return <OrderNowButton />;
};

export default OrderNowButtonWrapper;
