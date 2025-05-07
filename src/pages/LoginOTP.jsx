import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs"; // Import arrow icon from react-icons

const LoginOTP = () => {
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const inputRefs = useRef([]);

  // Initialize input refs for the 6 OTP input fields
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Get phone number from route state if available
  useEffect(() => {
    if (location.state && location.state.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = () => {
    if (isResendActive) {
      // Logic to resend OTP
      console.log(`Resending OTP to +92${phoneNumber}`);
      setTimer(60);
      setIsResendActive(false);
    }
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array with the new value
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Only take the first digit
    setOtp(newOtp);

    // Auto focus to next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Logo - Repositioned for better responsiveness */}
      <Link
        to="/"
        className="flex absolute top-4 md:top-8 left-4 md:left-8 items-center z-10"
      >
        <img src="/logo.webp" alt="Cheezious Logo" className="w-8 md:w-10" />
        <h1 className="font-bold text-xl md:text-2xl ml-2">Cheezious</h1>
      </Link>

      {/* Left Section */}
      <div className="w-full h-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Enter The Code We Sent</h1>
          <p className="text-text/60 mb-6 md:mb-10">To your cell phone number +92{phoneNumber}</p>
          
          <div className="flex justify-between w-full mb-6 gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-bold bg-text/5 rounded focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            ))}
          </div>
          
          <div className="text-center mb-6">
            <p className="text-text/50">
              Didn't Receive OTP Code? 
              <button 
                onClick={handleResendOTP}
                className={`ml-1 font-bold ${isResendActive ? 'text-primary cursor-pointer' : 'text-text/70 cursor-not-allowed'}`}
              >
                Resend
              </button>
            </p>
            <p className="text-text/60 mt-1">{formatTime(timer)}</p>
          </div>
          
          <button
            className="flex justify-center items-center w-full py-3 md:py-4 bg-primary text-text/80 font-bold rounded hover:bg-primary/80 hover:brightness-105 transition-colors"
          >
            <span className="mr-2">
              <BsArrowRight size={20} />
            </span>
            VERIFY
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

export default LoginOTP;
