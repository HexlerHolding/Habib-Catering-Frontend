const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  /**
   * Verify phone number existence using login endpoint
   * @param {string} phone - User's phone number
   * @returns {Promise<Object>} - Verification response
   */  
  async verifyPhone(phone) {
    try {
      // Format phone number - just send as is since backend expects exact match
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phone, password: 'check-exists-only' }),
      });      
      const data = await response.json();

      // If we get "Invalid credentials", it means phone exists but password is wrong
      if (data.error === 'Invalid credentials') {
        return { exists: true };
      }
      
      // If we get "User not found", phone doesn't exist
      if (data.error === 'User not found') {
        return { exists: false };
      }

      // For any other error, also return false
      return { exists: false };
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} - Registration response with token
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          email: userData.email, // Send email to backend
          password: userData.password,
        }),
      });

      const data = await response.json();
      console.log('Registration Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Extract user ID from the response - handle different response formats
      let userId = '';
      if (data.user && data.user._id) {
        userId = data.user._id;
      } else if (data._id) {
        userId = data._id;
      } else if (data.id) {
        userId = data.id;
      }

      // Create essential user data object
      const essentialUserData = {
        _id: userId,
        Name: userData.name,
        Phone: userData.phone
      };

      console.log('Essential user data stored after registration:', essentialUserData);
      
      // Store only essential user data in localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('user', JSON.stringify(essentialUserData));

      return {
        success: true,
        token: data.token,
        user: essentialUserData
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.phone - User's phone number
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} - Login response with token
   */
  async login(credentials) {
    try {      
      // Validate inputs
      if (!credentials.phone || !credentials.password) {
        throw new Error('Phone and password are required');
      }

      // Validate phone format (must be 11 digits starting with 0)
      // if (!/^0\d{10}$/.test(credentials.phone)) {
      //   throw new Error('Invalid phone number format. Must be 11 digits starting with 0');
      // }

      // Send phone number exactly as stored in database
      const formattedPhone = credentials.phone;
      
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store only essential user data (id, name, phone)
      if (data.token) {
        // Extract essential user data from response
        const userData = data.user || {};
        
        // Create a minimal user object with only essential fields
        const essentialUserData = {
          _id: userData._id || userData.id || '',
          Name: userData.Name || userData.name || '',
          Phone: userData.Phone || userData.phone || credentials.phone
        };
        
        console.log('Essential user data stored:', essentialUserData);
        
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(essentialUserData));
        
        // Add essential user data to the response for Redux store
        data.essentialUserData = essentialUserData;
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user and clean up storage
   */
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // No need to force a page refresh, let React Router handle navigation
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('userToken');
  },

  /**
   * Get authentication token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('userToken');
  },

  /**
   * Get authentication headers for protected requests
   * @returns {Object} - Headers object with Authorization token
   */
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  /**
   * Fetch authenticated user's profile
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    try {
      const response = await fetch(`${API_URL}/user/profile/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
   
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch profile');
      }
   
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update authenticated user's profile
   * @param {string} userId
   * @param {Object} updates - { name, phone, password }
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updates) {
    try {
      const response = await fetch(`${API_URL}/user/profile/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      // Update localStorage if name or phone changed
      if (data.token && data.user) {
        const essentialUserData = {
          _id: data.user._id || data.user.id || '',
          Name: data.user.Name || data.user.name || '',
          Phone: data.user.Phone || data.user.phone || '',
        };
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(essentialUserData));
      }
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

export default authService;