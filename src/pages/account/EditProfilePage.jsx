import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../../../Services/authService';
import { toast } from 'react-hot-toast';

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) return;
        const profile = await authService.getProfile(user._id);
        console.log('Fetched profile:', profile);
        setUserData({
          name: profile.Name || profile.name || '',
          phone: profile.Phone || profile.phone || '',
          password: '', // Never pre-fill password for security
        });
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) throw new Error('User not found');
      // Only send fields that are filled
      const updates = {};
      if (userData.name) updates.name = userData.name;
      if (userData.phone) updates.phone = userData.phone;
      if (userData.password) updates.password = userData.password;
      await authService.updateProfile(user._id, updates);
      toast.success('Profile updated successfully!');
      setUserData(prev => ({ ...prev, password: '' })); // Clear password field
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
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-text text-secondary py-3 px-6 rounded-lg font-medium hover:bg-text/80 transition-colors"
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
