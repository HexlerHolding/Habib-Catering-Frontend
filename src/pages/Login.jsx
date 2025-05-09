import React, { useState } from 'react';
import { FaPhone, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Simulating successful login with demo token and user data
            const userData = {
                id: '123',
                name: 'John Doe',
                email: 'john@example.com',
            };

            const token = 'demo-jwt-token';

            // Dispatch login action to Redux
            dispatch(login({ token, user: userData }));

            // Navigate to home page or redirect URL
            navigate('/');
        } catch (error) {
            // Handle login error
            console.error('Login failed', error);
        }
    };

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
            <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Hey there, feeling hungry?</h1>
                    <p className="text-text/60 mb-6 md:mb-10">Let's enjoy your food with cheezious!</p>
                    
                    <Link to='/login/phone-number' className="flex justify-center items-center w-full py-3 md:py-4 bg-primary text-text/90 font-bold rounded mb-4 hover:bg-primary/80 hover:brightness-105 transition-colors">
                        <FaPhone className="mr-2 text-lg" /> CONTINUE WITH PHONE
                    </Link>
                      <Link to='/' className="flex justify-center items-center w-full py-3 md:py-4 bg-background text-text/90 font-bold rounded border border-text/20 hover:bg-text/10 transition-colors">
                        <FaUser className="mr-2 text-lg" /> CONTINUE AS A GUEST
                    </Link>

                    <p className="mt-6 text-center text-text/60">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent hover:underline font-semibold">
                            Register here
                        </Link>
                    </p>
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

export default Login;
