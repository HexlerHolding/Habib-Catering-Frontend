import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const EditProfilePage = () => {
  // Mock user data - in a real app, you would get this from your auth state
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
    address: '123 Main Street, City, Country',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the user's profile via an API
    alert('Profile updated successfully!');
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
              />
            </div>
          </div>
          
          <div>
            <label className="block text-text/70 mb-2" htmlFor="address">Delivery Address</label>
            <div className="relative">
              <div className="absolute inset-y-0  h-12 left-0 flex items-center pl-3 pointer-events-none text-text/50">
                <FaMapMarkerAlt />
              </div>
              <textarea
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                rows="3"
                className="bg-background border border-text/10 text-text rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-text text-secondary py-3 px-6 rounded-lg font-medium hover:bg-text/80 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
