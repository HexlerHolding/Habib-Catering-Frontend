import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaUser, FaHistory, FaHeart, FaSignOutAlt } from 'react-icons/fa';

const AccountLayout = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);
  
  const navLinkClass = ({ isActive }) => 
    `flex items-center py-3 px-4 rounded-lg transition-all ${
      isActive 
        ? 'bg-primary text-text font-medium' 
        : 'hover:bg-text/5 text-text/70'
    }`;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-text">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64">
          <div className="bg-secondary rounded-lg shadow-sm p-4">
            <nav className="flex flex-col gap-2">
              <NavLink to="/account/profile" className={navLinkClass}>
                <FaUser className="mr-3" />
                Edit Profile
              </NavLink>
              <NavLink to="/account/orders" className={navLinkClass}>
                <FaHistory className="mr-3" />
                Order History
              </NavLink>
              <NavLink to="/account/favorites" className={navLinkClass}>
                <FaHeart className="mr-3" />
                Favorites
              </NavLink>
              <button className="flex items-center py-3 px-4 rounded-lg text-accent hover:bg-text/5 transition-all mt-4">
                <FaSignOutAlt className="mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-secondary rounded-lg shadow-sm p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
