import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrderNowButton = () => {
 
  return (
    <Link 
      to="/menu" 
      className={`fixed bottom-6 right-6 z-40 rounded-full flex items-center justify-center shadow-lg  bg-primary hover:bg-primary/80 hover:brightness-105 transition-all duration-300 transform hover:scale-105 px-3 py-3 md:px-5 md:py-4`}
    >
      <FaShoppingBag className="md:text-xl mr-2 text-secondary" />
      <span className="font-bold md:text-lg text-secondary">ORDER NOW</span>
    </Link>
  );
};

export default OrderNowButton;
