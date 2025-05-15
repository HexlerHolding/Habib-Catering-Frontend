import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from '../../Services/authService';
import { login } from '../redux/slices/authSlice';

const LoginPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no phone number or not verified, redirect back to phone entry
    if (!location.state?.phoneNumber || !location.state?.verified) {
      navigate('/login/phone-number');
      return;
    }
    setFormData(prev => ({
      ...prev,
      phone: location.state.phoneNumber
    }));
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        phone: formData.phone,
        password: formData.password
      });

      if (response.token) {
        // Login successful - update Redux store with token and essential user data
        dispatch(login({
          token: response.token,
          user: response.user || {},
          essentialUserData: response.essentialUserData || {
            _id: response.user?._id || '',
            Name: response.user?.Name || '',
            Phone: response.user?.Phone || formData.phone
          }
        }));
        
        console.log("Login successful with user data:", response.essentialUserData || response.user);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // If no phone number, don't render anything
  if (!location.state?.phoneNumber) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      <Link to="/" className="flex absolute top-4 md:top-8 left-4 md:left-8 items-center z-10">
        <img src="/offerSectionImage34.png" alt="Habib Catering Logo" className="w-8 md:w-10" />
        <h1 className="font-bold text-xl md:text-2xl ml-2">Habib Catering</h1>
      </Link>

      <div className="w-full h-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Enter Your Password</h1>
          <p className="text-text/60 mb-6 md:mb-10">
            For phone number {formData.phone}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                className="w-full py-3 pl-10 pr-12 border border-text/20 rounded focus:outline-none focus:border-primary bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60 hover:text-text/80 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-secondary cursor-pointer font-bold rounded hover:bg-primary/80 hover:brightness-105 transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        </div>
      </div>

      <div
        className="hidden md:block w-full md:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: "url(/blog1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default LoginPassword;
