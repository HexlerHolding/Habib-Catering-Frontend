import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import Register from "./pages/Register";
import LoginPhone from "./pages/LoginPhone";
import LoginPassword from "./pages/LoginPassword";
import BranchLocator from "./pages/BranchLocator";
import BranchDetail from "./pages/BranchDetail";
import BlogDetail from "./pages/BlogDetail";
import BlogsPage from "./pages/BlogsPage";
import AccountLayout from "./layouts/AccountLayout";
import EditProfilePage from "./pages/account/EditProfilePage";
import OrderHistoryPage from "./pages/account/OrderHistoryPage";
import OrderTrackingPage from "./pages/account/OrderTrackingPage";
import FavoritesPage from "./pages/account/FavoritesPage";
import SavedAddressesPage from "./pages/account/SavedAddressesPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Add effect to log authentication state on app mount
  useEffect(() => {
    console.log("App mounted - Auth state:", { isAuthenticated, user });
    setAuthChecked(true);
  }, [isAuthenticated, user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    // Let the component handle navigation instead of forcing a page reload
    navigate('/login');
  };

  // Layout props
  const layoutProps = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar: () => setIsSidebarOpen(false)
  };

  // Show loading while auth state is being determined
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
      <div className="app">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
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
          <Route
            path="/account"
            element={
              <ProtectedRoutes {...layoutProps}>
                <MainLayout {...layoutProps}>
                  <AccountLayout />
                </MainLayout>
              </ProtectedRoutes>
            }
          >
            <Route index element={<EditProfilePage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:orderId" element={<OrderTrackingPage />} />
            <Route path="addresses" element={<SavedAddressesPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
            {/* Authentication Routes */}          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : <Register />
          } />
          <Route path="/login/phone-number" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPhone />
          } />
          <Route path="/login/password" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPassword />
          } />
        </Routes>
      </div>
  );
}

export default App;