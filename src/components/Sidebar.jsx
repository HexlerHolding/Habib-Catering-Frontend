import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaPhoneAlt } from 'react-icons/fa';
import { BiUser } from 'react-icons/bi';
import { MdLocationOn, MdRestaurantMenu, MdHistory } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Sidebar = ({ isOpen, closeSidebar, isLoggedIn, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logout handler
  const handleLogout = () => {
    // Use Redux logout action instead of direct localStorage manipulation
    dispatch(logout());
    
    // Close sidebar
    closeSidebar();
    
    // Redirect to login page
    navigate('/login');
  };
  console.log("user", {user, isLoggedIn});

  return (
    <>
  
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-background shadow-lg`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 bg-primary`}>
          <div className="flex items-center">
            <div className={`h-10 w-10 mr-2 bg-primary rounded-full flex items-center justify-center`}>
              <BiUser className="w-6 h-6 text-text" />
            </div>
            <div>
              {isLoggedIn ? (
                <>
                  <div className="font-bold text-text">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm text-text">
                    {user?.phone || 'No phone'}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-text">
                    Login to explore
                  </div>
                  <div className="text-sm text-text">
                    World of flavors
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={closeSidebar}
            className="text-xl p-1 text-text"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Login/Logout button */}
        <div className="p-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full py-2 text-center rounded-md font-medium border border-text/30 text-text"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full py-2 text-center rounded-md font-medium border border-text/30 text-text"
              onClick={closeSidebar}
            >
              LOGIN
            </Link>
          )}
        </div>
        
        {/* Navigation links */}
        <nav className="px-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/menu"
                className="flex items-center text-text py-2"
                onClick={closeSidebar}
              >
                <div className="mr-3">
                  <MdRestaurantMenu className="w-6 h-6" />
                </div>
                <span className="font-medium text-text">Explore Menu</span>
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link 
                  to="/account/profile"
                  className="flex items-center text-text py-2"
                  onClick={closeSidebar}
                >
                  <div className="mr-3">
                    <MdHistory className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-text">Order History</span>
                </Link>
              </li>
            )}
            <li>
              <Link 
                to="/branches"
                className="flex items-center text-text py-2"
                onClick={closeSidebar}
              >
                <div className="mr-3">
                  <MdLocationOn className="w-6 h-6" />
                </div>
                <span className="font-medium font-montserrat text-text">Branch Locator</span>
              </Link>
            </li>
            <div className='flex flex-col items-start'>
              <Link to='/blogs' className="px-9 py-2 hover:underline text-text">
                <span>Blog</span>
              </Link>
              <Link to='/privacy-policy' className="px-9 py-2 hover:underline text-text" onClick={closeSidebar}>
                <span>Privacy Policy</span>
              </Link>
            </div>
          </ul>
        </nav>
        
        {/* Hotline */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-primary`}>
          <div className="flex items-center">
            <img 
              src="/logo.webp" 
              alt="Cheezious Icon"
              className="h-8 w-8 mr-2"
            />
            <div className="text-text font-medium">Cheezious Hotline</div>
          </div>
          <a 
            href="tel:111111111"
            className={`bg-text text-secondary p-2 rounded-full flex items-center justify-center`}
          >
            <FaPhoneAlt className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;