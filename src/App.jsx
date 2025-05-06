import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectCurrentUser, logout } from "./redux/slices/authSlice";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
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
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
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
      <main className="content">{children}</main>
      <Footer />
      {/* <OrderNowButtonWrapper /> */}
    </>
  );
};

// New component to debug and ensure authenticated access
const ProtectedAccountRoutes = ({ isSidebarOpen, toggleSidebar, closeSidebar }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  
  console.log("Protected Account Route Check:", { isAuthenticated, user });
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      closeSidebar={closeSidebar}
    >
      <AccountLayout />
    </MainLayout>
  );
};

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
              >
                <MenuPage />
              </MainLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
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
              >
                <BlogDetail />
              </MainLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
              >
                <CheckoutPage />
              </MainLayout>
            }
          />
          <Route
            path="/order-success"
            element={
              <OrderSuccessPage />
            }
          />
          {/* Modified account routes with explicit protection */}
          <Route
            path="/account"
            element={
              <ProtectedAccountRoutes
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                closeSidebar={() => setIsSidebarOpen(false)}
              />
            }
          >
            <Route index element={<EditProfilePage />} />
            <Route path="profile" element={<EditProfilePage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/login/phone-number" 
            element={<LoginPhone />} 
          />
          <Route 
            path="/login/otp" 
            element={<LoginOTP />} 
          />
        </Routes>
      </div>
  );
}

export default App;