import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectCurrentUser, logout } from "./redux/slices/authSlice";
import MainLayout from "./components/MainLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import "./App.css";
import Login from "./pages/Login";
import LoginPhone from "./pages/LoginPhone";
import LoginOTP from "./pages/LoginOTP";
import BranchLocator from "./pages/BranchLocator";
import BranchDetail from "./pages/BranchDetail";
import BlogDetail from "./pages/BlogDetail";
import BlogsPage from "./pages/BlogsPage";
import AccountLayout from "./layouts/AccountLayout";
import EditProfilePage from "./pages/account/EditProfilePage";
import OrderHistoryPage from "./pages/account/OrderHistoryPage";
import FavoritesPage from "./pages/account/FavoritesPage";
import SavedAddressesPage from "./pages/account/SavedAddressesPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Add effect to log authentication state on app mount
  useEffect(() => {
    console.log("App mounted - Auth state:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    // Navigate to home page after logout
    window.location.href = '/';
  };

  // Layout props
  const layoutProps = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar: () => setIsSidebarOpen(false)
  };

  return (
      <div className="app">
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route
            path="/"
            element={
              <MainLayout {...layoutProps}>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/menu"
            element={
              <MainLayout {...layoutProps}>
                <MenuPage />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout {...layoutProps}>
                <CartPage />
              </MainLayout>
            }
          />
          <Route
            path="/branches"
            element={
              <MainLayout {...layoutProps}>
                <BranchLocator />
              </MainLayout>
            }
          />
          <Route
            path="/branches/:branchId"
            element={
              <MainLayout {...layoutProps}>
                <BranchDetail />
              </MainLayout>
            }
          />
          <Route
            path="/blogs"
            element={
              <MainLayout {...layoutProps}>
                <BlogsPage />
              </MainLayout>
            }
          />
          <Route
            path="/blogs/:slug"
            element={
              <MainLayout {...layoutProps}>
                <BlogDetail />
              </MainLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <MainLayout {...layoutProps}>
                <PrivacyPolicy />
              </MainLayout>
            }
          />
          
          {/* Protected Routes - Require Authentication */}
          {/* Checkout Process */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoutes {...layoutProps}>
                <CheckoutPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoutes {...layoutProps}>
                <OrderSuccessPage />
              </ProtectedRoutes>
            }
          />
          
          {/* Protected account routes */}
          <Route path="/account" element={<ProtectedRoutes {...layoutProps}><AccountLayout /></ProtectedRoutes>}>
            <Route index element={<EditProfilePage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="addresses" element={<SavedAddressesPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/phone-number" element={<LoginPhone />} />
          <Route path="/login/otp" element={<LoginOTP />} />
        </Routes>
      </div>
  );
}

export default App;