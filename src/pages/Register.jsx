import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaLock, FaPhone, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../Services/authService';
import { login } from '../redux/slices/authSlice';
import { TITLE, PHONE_INPUT_CONFIG } from '../data/globalText';

const Register = () => {    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '', // Add email field
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Phone number validation
        if (name === 'phone') {
            // Only allow numbers and limit to PHONE_INPUT_CONFIG.maxLength digits
            const numbersOnly = value.replace(/[^\d]/g, '');
            if (numbersOnly.length <= PHONE_INPUT_CONFIG.maxLength) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numbersOnly
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        setError(''); // Clear error when user types
    };    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log('Form Data:', formData);

        // Basic validation
        if (!formData.name || !formData.phone || !formData.password || !formData.email) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        // Phone number validation
        if (formData.phone.length < PHONE_INPUT_CONFIG.maxLength) {
            const msg = `Phone number must be ${PHONE_INPUT_CONFIG.maxLength} digits`;
            setError(msg);
            toast.error(msg);
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                name: formData.name,
                phone: formData.phone,
                email: formData.email, // Pass email to service
                password: formData.password
            });
            
            if (response.token) {
                console.log('Registration Response:', response);
                
                // Store token and essential user data in Redux
                dispatch(login({ 
                    token: response.token,
                    user: response.user // This will contain only essential data now
                }));

                // Show success message
                toast.success('Registration successful!');
                
                // Navigate to home page after successful registration
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
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
                <Link to="/" className="flex items-center">
                    <img 
                        src='/offerSectionImage34.png'
                        alt={`${TITLE} Logo`}
                        className="w-8 md:w-10"
                    />
                    <h1 className='font-bold text-xl md:text-2xl ml-2 text-text'>{TITLE}</h1>
                </Link>
            </div>

            {/* Left Section - Registration Form */}
            <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
                <div className="max-w-md w-full">
                    <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90 text-center">Create Account</h1>
                    <p className="text-text/60 mb-6 md:mb-8 text-center">Join us and start ordering your favorite food!</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full py-3 pl-10 pr-4  bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50 "
                            />
                        </div>

                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={PHONE_INPUT_CONFIG.placeholder}
                                maxLength={PHONE_INPUT_CONFIG.maxLength}
                                className="w-full py-3 pl-10 pr-4  bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
                            />
                        </div>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full py-3 pl-10 pr-4  bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50 "
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full py-3 pl-10 pr-12  bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
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
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-text/60">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Background Image */}
            <div className="hidden md:block w-full md:w-1/2 relative overflow-hidden" 
                style={{
                    backgroundImage: "url(/blog2.jpg)", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
            </div>
        </div>
    );
};

export default Register;
