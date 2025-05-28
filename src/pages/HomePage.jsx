import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddresses, selectSavedAddresses } from '../redux/slices/locationSlice';
import { selectIsAuthenticated, selectUserId } from '../redux/slices/authSlice';
import AppDownload from '../components/AppDownload';
import BlogSection from '../components/BlogSection';
import CategorySlider from '../components/CategorySlider';
import HeroSlider from '../components/HeroSlider';
import Offer from '../components/Offer';
import AddressSelector from '../components/AddressSelector';
import toast from 'react-hot-toast';

const HomePage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userId = useSelector(selectUserId);
  const savedAddresses = useSelector(selectSavedAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressPromptShown, setAddressPromptShown] = useState(false); // Add this flag

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserAddresses(userId));
    }
  }, [isAuthenticated, userId, dispatch]);

  useEffect(() => {
    if (
      isAuthenticated &&
      userId &&
      savedAddresses &&
      savedAddresses.length === 0 &&
      !addressPromptShown
    ) {
      // Show modal after 4 seconds delay
      const timer = setTimeout(() => {
        toast.error('Please add a delivery address to continue');
        setShowAddressModal(true);
        setAddressPromptShown(true); // Set flag so it doesn't show again
      }, 4000);

      // Cleanup timer if component unmounts or dependencies change
      return () => clearTimeout(timer);
    } else if (savedAddresses && savedAddresses.length > 0) {
      setShowAddressModal(false);
      setAddressPromptShown(false); // Reset flag if addresses are added
    }
  }, [savedAddresses, isAuthenticated, userId, addressPromptShown]);

  return (
    <div className="relative bg-background">
      {/* Show address modal if no address is saved */}
      {showAddressModal && (
        <AddressSelector 
          onClose={() => setShowAddressModal(false)} 
          forceMapView 
        />
      )}
      
      {/* Hero Slider */}
      <HeroSlider />
      
      <div className="mx-auto px-6 sm:px-40 xl:px-[15rem] py-8">
        {/* Category Slider - Replacing the previous Explore Menu section */}
        <CategorySlider />
        
        {/* Home Page Cards */}
        {/* <HomePageCards /> */}
        
        {/* App Download Component - Added here */}
        {/* <div className="my-12">
          <AppDownload />
        </div> */}
        <div className="my-12">
          <BlogSection />
        </div>
      </div>
      
      {/* Offer Section */}
      <Offer />
    </div>
  );
};


export default HomePage;