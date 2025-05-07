import React, { useState } from "react";
import { FaPhone, FaUser, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = () => {
    // Logic to send OTP to the entered phone number
    console.log(`Sending OTP to +92${phoneNumber}`);
    // Navigate to OTP page with phone number as state
    navigate("/login/otp", { state: { phoneNumber } });
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Only allow digits and limit to 10 characters
    const digitsOnly = input.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly);
    }
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
      <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Enter Your Phone Number</h1>
          <p className="text-text/60 mb-6 md:mb-10">We will send you the code to confirm it.</p>
          
          <div className="flex w-full mb-6">
            <div className="bg-text/5 p-3 rounded-l-lg flex items-center justify-center font-medium">
              +92
            </div>
            <input
              type="tel"
              placeholder="301xxxxxxx"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={10}
              className="flex-grow p-3 bg-text/5 rounded-r-lg focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleSendOTP}
            className="flex justify-center items-center w-full py-3 md:py-4 bg-primary text-text/90 font-bold rounded hover:bg-primary/80 hover:brightness-105 transition-colors"
          >
            <span className="mr-2">
              <FaEnvelope size={20} />
            </span>
            SEND OTP
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
