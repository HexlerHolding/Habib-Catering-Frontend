import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage"; // Import new CartPage
import CheckoutPage from "./pages/CheckoutPage"; // Import CheckoutPage
import OrderSuccessPage from "./pages/OrderSuccessPage"; // Import OrderSuccessPage
import "./App.css";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import LoginPhone from "./pages/LoginPhone";
import LoginOTP from "./pages/LoginOTP";
import BranchLocator from "./pages/BranchLocator";
import BlogDetail from "./pages/BlogDetail";
import BlogsPage from "./pages/BlogsPage";
import OrderNowButtonWrapper from "./components/OrderNowButtonWrapper";
import AccountLayout from "./layouts/AccountLayout";
import EditProfilePage from "./pages/account/EditProfilePage";
import OrderHistoryPage from "./pages/account/OrderHistoryPage";
import FavoritesPage from "./pages/account/FavoritesPage";

// Layout component for pages that should include Navbar and Footer
const MainLayout = ({
  children,
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
  isLoggedIn,
  user,
}) => {
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={closeSidebar}
        isLoggedIn={isLoggedIn}
        user={user}
      />
      <main className="content">{children}</main>
      <Footer />
      <OrderNowButtonWrapper />
    </>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);

  // Check for authentication status on component mount
  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Login function (call this when user successfully logs in)
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    // Navigate to home page after logout
    window.location.href = '/';
  };

  return (
   
      <div className="app">
        <Routes>
          {/* Routes with Navbar and Footer */}
          <Route
            path="/"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/menu"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <MenuPage />
              </MainLayout>
            }
          />
          {/* Add Cart Route */}
          <Route
            path="/cart"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <CartPage />
              </MainLayout>
            }
          />
          <Route
            path="/branches"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <BranchLocator />
              </MainLayout>
            }
          />
          <Route
            path="/blogs"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <BlogsPage />
              </MainLayout>
            }
          />
          <Route
            path="/blogs/:slug"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <BlogDetail />
              </MainLayout>
            }
          />

          {/* Add Checkout Route */}
          <Route
            path="/checkout"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <CheckoutPage />
              </MainLayout>
            }
          />
          
          {/* Add Order Success Route */}
          <Route
            path="/order-success"
            element={
              <OrderSuccessPage />
            }
          />

          {/* Account routes - fixed to avoid nesting Routes */}
          <Route
            path="/account"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
                user={user}
              >
                <AccountLayout isLoggedIn={isLoggedIn} user={user} />
              </MainLayout>
            }
          >
            <Route index element={<EditProfilePage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>

          {/* Login route without Navbar and Footer */}
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/login/phone-number" 
            element={<LoginPhone onLogin={handleLogin} />} 
          />
          <Route 
            path="/login/otp" 
            element={<LoginOTP onLogin={handleLogin} />} 
          />

          {/* Add more routes as needed */}
        </Routes>
      </div>

  );
}

export default App;