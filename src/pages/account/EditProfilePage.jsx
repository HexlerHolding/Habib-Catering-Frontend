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
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showModalNewPassword, setShowModalNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalPasswordValidation, setModalPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [showModalCurrentPassword, setShowModalCurrentPassword] = useState(false);

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
        console.log('Fetched profile:', profile);
        setUserData({
          name: profile.Name || profile.name || '',
          email: profile.Email || profile.email || '',
          phone: profile.Phone || profile.phone || '',
          password: '',
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setProfileLoading(false);
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

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setCurrentPassword("");
    setNewPassword("");
    setModalPasswordValidation({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecial: false
    });
  };
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };
  const handleModalNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setModalPasswordValidation(validatePassword(e.target.value));
  };
  const handleModalCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.Phone) throw new Error('User not found');
      // Validate current password by login
      await authService.login({ phone: user.Phone, password: currentPassword });
      // Validate new password
      const { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial } = modalPasswordValidation;
      if (!(minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
        toast.error('New password does not meet all requirements');
        setModalLoading(false);
        return;
      }
      // Update password
      await authService.updateProfile(user._id, { password: newPassword });
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setModalLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    );
  }

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
                type={showMainPassword ? "text" : "password"}
                id="password"
                name="password"
                value={userData.password}
                onFocus={handleOpenPasswordModal}
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 pr-12 p-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                placeholder="Click to change password"
                readOnly
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text/50"
                onClick={() => setShowMainPassword((prev) => !prev)}
                style={{ background: 'none', border: 'none' }}
              >
                {showMainPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-modal/50 bg-opacity-40">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md border border-primary">
            <h3 className="text-lg font-semibold mb-4 text-primary">Change Password</h3>
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-text/70 mb-1" htmlFor="currentPassword">Current Password</label>
                <div className="relative">
                  <input
                    type={showModalCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={handleModalCurrentPasswordChange}
                    className="bg-background border border-text/10 text-text rounded-lg block w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text/50"
                    onClick={() => setShowModalCurrentPassword((prev) => !prev)}
                    style={{ background: 'none', border: 'none' }}
                  >
                    {showModalCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-text/70 mb-1" htmlFor="newPassword">New Password</label>
                <div className="relative">
                  <input
                    type={showModalNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={handleModalNewPasswordChange}
                    className="bg-background border border-text/10 text-text rounded-lg block w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder='Enter your new password'
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text/50"
                    onClick={() => setShowModalNewPassword((prev) => !prev)}
                    style={{ background: 'none', border: 'none' }}
                  >
                    {showModalNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="text-xs space-y-1 text-text/70 mt-2">
                  <p className="font-semibold">Password must have:</p>
                  <ul className="pl-4 space-y-0.5">
                    <li className={modalPasswordValidation.minLength ? "text-green-600" : "text-red-500"}>
                      At least 8 characters
                    </li>
                    <li className={modalPasswordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}>
                      At least 1 uppercase letter (A-Z)
                    </li>
                    <li className={modalPasswordValidation.hasLowerCase ? "text-green-600" : "text-red-500"}>
                      At least 1 lowercase letter (a-z)
                    </li>
                    <li className={modalPasswordValidation.hasNumber ? "text-green-600" : "text-red-500"}>
                      At least 1 number (0-9)
                    </li>
                    <li className={modalPasswordValidation.hasSpecial ? "text-green-600" : "text-red-500"}>
                      At least 1 special character (!@#$%^&*...)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="bg-text/10 text-text px-4 py-2 rounded cursor-pointer hover:bg-text/20"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-secondary px-4 py-2 cursor-pointer rounded hover:bg-primary/80 font-medium"
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
