import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import "./App.css";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import LoginPhone from "./pages/LoginPhone";
import LoginOTP from "./pages/LoginOTP";
import BranchLocator from "./pages/BranchLocator";
import BlogDetail from "./pages/BlogDetail";
import BlogsPage from "./pages/BlogsPage";
import OrderNowButtonWrapper from "./components/OrderNowButtonWrapper";

// Layout component for pages that should include Navbar and Footer
const MainLayout = ({
  children,
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
}) => {
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <main className="content">{children}</main>
      <Footer />
      <OrderNowButtonWrapper />
    </>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

          {/* Login route without Navbar and Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/phone-number" element={<LoginPhone />} />
          <Route path="/login/otp" element={<LoginOTP />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
  );
}

export default App;