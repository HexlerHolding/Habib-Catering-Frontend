import { BiUser } from 'react-icons/bi';
import { FaPhoneAlt, FaTimes } from 'react-icons/fa';
import { MdHistory, MdLocationOn, MdRestaurantMenu } from 'react-icons/md';
import { MdOutlineArticle, MdOutlinePrivacyTip } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { TITLE } from '../data/globalText';
import { CONTACT_INFO } from '../data/globalText';

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

  // Determine user name and phone to display
  const displayName = user?.Name || user?.name || 'User';
  const displayPhone = user?.Phone || user?.phone || 'No phone';

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
              <BiUser className="w-6 h-6 text-secondary" />
            </div>
            <div>
              {isLoggedIn ? (
                <>
                  <div className="font-bold text-secondary">
                    {displayName}
                  </div>
                  <div className="text-sm text-secondary">
                    {displayPhone}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-secondary">
                    Login to explore
                  </div>
                  <div className="text-sm text-secondary">
                    World of flavors
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={closeSidebar}
            className="text-xl p-1 text-secondary cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Login/Logout button */}
        <div className="p-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full py-2 text-center rounded-md cursor-pointer hover:bg-primary/90 hover:text-secondary transition-all duration-300 font-medium border border-text/30 text-text"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full py-2 text-center rounded-md cursor-pointer hover:bg-primary/90 hover:text-secondary transition-all duration-300 font-medium border border-text/30 text-text"
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
            <li>
              <Link 
                to="/blogs"
                className="flex items-center text-text py-2"
                onClick={closeSidebar}
              >
                <div className="mr-3">
                  <MdOutlineArticle className="w-6 h-6" />
                </div>
                <span className="font-medium text-text">Blog</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy-policy"
                className="flex items-center text-text py-2"
                onClick={closeSidebar}
              >
                <div className="mr-3">
                  <MdOutlinePrivacyTip className="w-6 h-6" />
                </div>
                <span className="font-medium text-text">Privacy Policy</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Hotline */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-primary`}>
          <div className="flex items-center">
            <img 
              src="/offerSectionImage34.png" 
              alt="Cheezious Icon"
              className="h-6 mr-2"
            />
            <div className="text-secondary font-medium">{TITLE} Hotline</div>
          </div>
          <a 
            href={`tel:${CONTACT_INFO.phone}`}
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