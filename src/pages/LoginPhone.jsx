import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../Services/authService";
import { TITLE, PHONE_INPUT_CONFIG } from "../data/globalText";

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Removed strict validation, only check for length
  const validatePhoneNumber = (number) => {
    return number.length === PHONE_INPUT_CONFIG.maxLength;
  };

  const handleVerifyPhone = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error(`Please enter a valid phone number (${PHONE_INPUT_CONFIG.maxLength} digits)`);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyPhone(phoneNumber);
      if (response.exists) {
        toast.success('Phone number verified');
        navigate("/login/password", { 
          state: { 
            phoneNumber: phoneNumber, // Pass as entered
            verified: true 
          } 
        });
      } else {
        toast.error('Phone number not registered');
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Only allow digits and limit to maxLength
    let digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length <= PHONE_INPUT_CONFIG.maxLength) {
      setPhoneNumber(digitsOnly);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Top Bar: Back Arrow + Logo */}
      <div className="flex items-start flex-col-reverse gap-4 absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <button
          className="flex items-center text-primary cursor-pointer hover:text-accent font-medium px-2 py-1 rounded transition-colors"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <Link
          to="/"
          className="flex items-center"
        >
          <img src="/offerSectionImage34.png" alt={`${TITLE} Logo`} className="w-8 md:w-10" />
          <h1 className="font-bold text-xl md:text-2xl ml-2 text-text">{TITLE}</h1>
        </Link>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Enter Your Phone Number</h1>
          <p className="text-text/60 mb-6 md:mb-10">We will send you the code to confirm it.</p>
          <div className="flex w-full mb-6">
            <input
              type="tel"
              placeholder={PHONE_INPUT_CONFIG.placeholder}
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={PHONE_INPUT_CONFIG.maxLength}
              className="flex-grow p-3 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50 "
            />
          </div>
          <button
            onClick={handleVerifyPhone}
            disabled={loading}
            className="flex justify-center cursor-pointer items-center w-full py-3 md:py-4 bg-primary text-secondary font-bold rounded hover:bg-primary/80 hover:brightness-105 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">
              <FaEnvelope size={20} />
            </span>
            {loading ? 'Verifying...' : 'Continue with Phone'}
          </button>
        </div>
      </div>

      {/* Right Section - Using Background Image */}
      <div
        className="hidden md:block w-full md:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: "url(/blog1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default LoginPhone;
