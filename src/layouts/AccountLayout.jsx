import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';
import { FaUser, FaHistory, FaHeart, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const AccountLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("AccountLayout mounted - Auth state:", isAuthenticated);
    
    // Double check auth status and navigate if not authenticated
    if (!isAuthenticated) {
      console.log("Not authenticated in AccountLayout, redirecting");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Ensure we're authenticated before rendering
  if (!isAuthenticated) {
    console.log("Not rendering AccountLayout - not authenticated");
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center py-2 px-4 rounded-lg transition-all ${
      isActive 
        ? 'bg-primary text-secondary font-medium' 
        : 'hover:bg-text/5 text-text/70'
    }`;

  return (
    <div className="mx-auto px-4 pt-14 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-text">My Account</h1>
      
      <div className="flex flex-col gap-6">
        {/* Top Navigation */}
        <div className="w-full">
          <div className="bg-background rounded-lg shadow-sm p-3">
            <nav className="flex flex-col sm:flex-row flex-wrap gap-2 justify-between w-full">
              <div className="flex flex-wrap gap-2">
                <NavLink to="/account/profile" className={navLinkClass}>
                  <FaUser className="mr-2" />
                  Edit Profile
                </NavLink>
                <NavLink to="/account/orders" className={navLinkClass}>
                  <FaHistory className="mr-2" />
                  Order History
                </NavLink>
                <NavLink to="/account/addresses" className={navLinkClass}>
                  <FaMapMarkerAlt className="mr-2" />
                  Saved Addresses
                </NavLink>
                <NavLink to="/account/favorites" className={navLinkClass}>
                  <FaHeart className="mr-2" />
                  Favorites
                </NavLink>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center py-2 px-4 rounded-lg text-secondary bg-accent hover:bg-accent/80 hover:brightness-105 transition-all mt-2 sm:mt-0"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content Area - Full Width */}
        <div className="w-full">
          <div className="bg-background rounded-lg shadow-sm p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
