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
          phone: userData.phone, // Send phone number as is
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return {
        success: true,
        token: data.token,
        user: {
          name: userData.name,
          phone: userData.phone
        }
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
      if (!/^0\d{10}$/.test(credentials.phone)) {
        throw new Error('Invalid phone number format. Must be 11 digits starting with 0');
      }

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

      // If the API doesn't return user data, create a user object with the phone number
      if (data.token) {
        // Create a minimum user object if none was returned
        if (!data.user) {
          data.user = {
            phone: credentials.phone,
            name: "User" // Default name, will be updated later if available
          };
        }
        
        // Ensure we have the phone number in the user data
        if (!data.user.phone) {
          data.user.phone = credentials.phone;
        }

        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
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
  }
};

export default authService;