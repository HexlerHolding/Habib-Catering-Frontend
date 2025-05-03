import React from 'react'
import { FaPhone, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const Login = () => {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
        {/* Logo - Repositioned for better responsiveness */}
        <Link to="/" className="flex absolute top-4 md:top-8 left-4 md:left-8 items-center z-10">
          <img 
            src='/logo.webp'
            alt="Cheezious Logo" 
            className="w-8 md:w-10"
          />
          <h1 className='font-bold text-xl md:text-2xl ml-2'>Cheezious</h1>
        </Link>

        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-white pt-20 md:pt-8">
    <div className="max-w-md w-full text-center">
      <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">Hey there, feeling hungry?</h1>
      <p className="text-gray-500 mb-6 md:mb-10">Let's enjoy your food with cheezious!</p>
      
      <Link to='/login/phone-number' className="flex justify-center items-center w-full py-3 md:py-4 bg-yellow-300 text-gray-800 font-bold rounded mb-4 hover:bg-yellow-400 transition-colors">
        <FaPhone className="mr-2 text-lg" /> CONTINUE WITH PHONE
      </Link>
      
      <button className="flex justify-center items-center w-full py-3 md:py-4 bg-white text-gray-800 font-bold rounded border border-gray-300 hover:bg-gray-50 transition-colors">
        <FaUser className="mr-2 text-lg" /> CONTINUE AS A GUEST
      </button>
    </div>
  </div>

        {/* Right Section - Using Background Image */}
        <div className="hidden md:block w-full md:w-1/2 relative overflow-hidden" 
             style={{
               backgroundImage: "url(/blog1.jpg)", 
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
       
        </div>
      </div>
    );
  };
  
export default Login
