import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import authService from '../../../Services/authService';
import { toast } from 'react-hot-toast';
import { PHONE_INPUT_CONFIG } from '../../data/globalText';

const EditProfilePage = () => {  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', // Single password field
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Password validation function (copied from Register)
  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) return;
        const profile = await authService.getProfile(user._id);
        console
        console.log('Fetched profile:', profile);        setUserData({
          name: profile.Name || profile.name || '',
          email: profile.Email || profile.email || '',
          phone: profile.Phone || profile.phone || '',
          password: '',
        });
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPasswordValidation(validatePassword(value));
    }
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) throw new Error('User not found');
      const updates = {};
      if (userData.name) updates.name = userData.name;
      if (userData.email) updates.email = userData.email;
      if (userData.phone) updates.phone = userData.phone;
      // If new password is being set, validate it
      if (userData.password) {
        const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial } = passwordValidation;
        if (!(minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
          toast.error('New password does not meet all requirements');
          setLoading(false);
          return;
        }
        updates.password = userData.password;
      }
      await authService.updateProfile(user._id, updates);
      toast.success('Profile updated successfully!');
      setUserData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-text">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-text/70 mb-2" htmlFor="name">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text/50">
                <FaUser />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-text/70 mb-2" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text/50">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-text/70 mb-2" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text/50">
                <FaPhone />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                readOnly
                maxLength={PHONE_INPUT_CONFIG.maxLength}
                placeholder={PHONE_INPUT_CONFIG.placeholder}
              />
            </div>
          </div>
          <div>
            <label className="block text-text/70 mb-2" htmlFor="password">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text/50">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 pr-12 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60 hover:text-text/80 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Password requirements display */}
            <div className="text-xs space-y-1 text-text/70 mt-2">
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
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-secondary cursor-pointer py-3 px-6 rounded-lg font-medium hover:bg-primary/80 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
