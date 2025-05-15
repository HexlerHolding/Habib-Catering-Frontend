import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../redux/slices/authSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import OrderNowButtonWrapper from './OrderNowButtonWrapper';

const MainLayout = ({
  children,
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={closeSidebar}
        isLoggedIn={isAuthenticated}
        user={user}
      />
      <main className="content bg-background">{children}</main>
      <Footer />
      <OrderNowButtonWrapper />
    </>
  );
};

export default MainLayout;
