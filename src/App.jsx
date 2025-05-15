import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AccountLayout from "./layouts/AccountLayout";
import EditProfilePage from "./pages/account/EditProfilePage";
import FavoritesPage from "./pages/account/FavoritesPage";
// import OrderHistoryPage from "./pages/account/OrderHistoryPage";
// import OrderTrackingPage from "./pages/account/OrderTrackingPage";
import SavedAddressesPage from "./pages/account/SavedAddressesPage";
import BlogDetail from "./pages/BlogDetail";
import BlogsPage from "./pages/BlogsPage";
import BranchDetail from "./pages/BranchDetail";
import BranchLocator from "./pages/BranchLocator";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Contact from "./pages/Contact";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";
import LoginPhone from "./pages/LoginPhone";
import MenuPage from "./pages/MenuPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import { logout, selectCurrentUser, selectIsAuthenticated } from "./redux/slices/authSlice";

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
        <Route
          path="/contact"
          element={
            <MainLayout {...layoutProps}>
              <Contact />
            </MainLayout>
          }
        />
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes {...layoutProps}>
              <MainLayout {...layoutProps}>
                <CheckoutPage />
              </MainLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoutes {...layoutProps}>
              <MainLayout {...layoutProps}>
                <OrderSuccessPage />
              </MainLayout>
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
          {/* <Route path="orders" element={<OrderHistoryPage />} /> */}
          {/* <Route path="orders/:orderId" element={<OrderTrackingPage />} /> */}
          <Route path="addresses" element={<SavedAddressesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
        {/* Authentication Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login/phone-number"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPhone />}
        />
        <Route
          path="/login/password"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;