import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaLock, FaPhone, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../Services/authService';
import { login } from '../redux/slices/authSlice';
import { TITLE } from '../data/globalText';
import OtpModal from '../components/OtpModal';

const COUNTRY_OPTIONS = [
  { code: 'US', label: '+1 (USA)', value: '+1' },
  { code: 'PK', label: '+92 (Pakistan)', value: '+92' },
  // Add more countries as needed
];

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
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecial: false
    });
    const [country, setCountry] = useState(COUNTRY_OPTIONS[0].code);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [pendingUserId, setPendingUserId] = useState(null);
    const [pendingPhone, setPendingPhone] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();    
    
    // Password validation function
    const validatePassword = (password) => {
        return {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            // Only allow numbers (and optional + for international)
            const numbersOnly = value.replace(/[^\d+]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numbersOnly
            }));
        } else if (name === 'password') {
            // Update password validation state
            setPasswordValidation(validatePassword(value));
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        setError(''); // Clear error when user types
    };    
    
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
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

        // Additional password validation check before submission
        const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial } = passwordValidation;
        if (!(minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
            setError('Password does not meet all requirements');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                country: country,
            });
            // Show OTP modal if userId is present in response
            if (response && response.userId) {
                setPendingUserId(response.userId);
                setPendingPhone(`${COUNTRY_OPTIONS.find(c => c.code === country)?.value || ''}${formData.phone}`);
                setShowOtpModal(true);
            } else if (response.token) {
                // Fallback: if token is returned directly
                dispatch(login({ 
                    token: response.token,
                    user: response.user
                }));
                toast.success('Registration successful!');
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // OTP submit handler
    const handleOtpSubmit = async (otp) => {
        setOtpLoading(true);
        try {
            const result = await authService.verifyOtp(pendingUserId, otp);
            if (result.token) {
                dispatch(login({ token: result.token, user: result.essentialUserData || result.user }));
                toast.success('Account verified!');
                setShowOtpModal(false);
                navigate('/');
            } else {
                toast.error('OTP verification failed.');
            }
        } catch (err) {
            toast.error(err.message || 'OTP verification failed.');
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-auto">
            {/* OTP Modal */}
            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSubmit={handleOtpSubmit}
                phone={pendingPhone}
                loading={otpLoading}
            />
            {/* Fixed Header Bar */}
            <div className="fixed top-0 left-0 right-0 bg-background z-20 md:absolute md:bg-transparent">
                <div className="flex items-start flex-col-reverse gap-4 p-4 md:p-0 md:top-8 md:left-8 md:absolute">
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
            </div>

            {/* Left Section - Registration Form */}
            <div className="w-full md:w-1/2 bg-background mt-10 pt-24 md:pt-8 px-4 md:px-8 pb-8 ">
                <div className="max-w-md mx-auto  md:mt-24 ">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Create Account</h1>
                        <p className="text-text/60 mb-6 md:mb-8">Join us and start ordering your favorite food!</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Country code selector */}
                        <div className="relative">
                            <select
                                name="country"
                                value={country}
                                onChange={handleCountryChange}
                                className="w-full py-3 pl-3 pr-4 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
                            >
                                {COUNTRY_OPTIONS.map(opt => (
                                    <option key={opt.code} value={opt.code}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full py-3 pl-10 pr-4 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
                            />
                        </div>

                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full py-3 pl-10 pr-4 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
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
                                className="w-full py-3 pl-10 pr-4 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
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
                                className="w-full py-3 pl-10 pr-12 bg-text/5 rounded focus:outline-text focus:outline-2 outline-1 outline-text/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60 hover:text-text/80 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        
                        {/* Password requirements display */}
                        <div className="text-xs space-y-1 text-text/70">
                            <p className="font-semibold">Password must have:</p>
                            <ul className="pl-4 space-y-0.5">
                                <li className={passwordValidation.minLength ? "text-green-600" : "text-red-500"}>
                                    At least 8 characters
                                </li>
                                <li className={passwordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}>
                                    At least 1 uppercase letter (A-Z)
                                </li>
                                <li className={passwordValidation.hasLowerCase ? "text-green-600" : "text-red-500"}>
                                    At least 1 lowercase letter (a-z)
                                </li>
                                <li className={passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}>
                                    At least 1 number (0-9)
                                </li>
                                <li className={passwordValidation.hasSpecial ? "text-green-600" : "text-red-500"}>
                                    At least 1 special character (!@#$%^&*...)
                                </li>
                            </ul>
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
            <div className="hidden md:block w-full md:w-1/2 min-h-screen" 
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