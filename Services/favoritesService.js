const API_URL = import.meta.env.VITE_API_URL;

// Helper to extract userId from JWT (if needed)
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch {
    return null;
  }
}

export const favoritesService = {
  async getFavorites(token) {
    const userId = getUserIdFromToken(token);
    console.log('token', token);
    if (!userId) return [];
    try {
      const response = await fetch(`${API_URL}/user/fav/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      console.log('response', response);
      const data = await response.json();
      console.log('data', data);
      return data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  async addFavorite(productId, token) {
    console.log('item id', productId);
    const userId = getUserIdFromToken(token);
    console.log('token', token);
    console.log('userId', userId);
    if (!userId) return null;
    try {
      const response = await fetch(`${API_URL}/user/fav/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ Product_Id: productId })
      });
      console.log('response', response);
      if (!response.ok) throw new Error('Failed to add favorite');
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      return null;
    }
  },

  async removeFavorite(productId, token) {
    const userId = getUserIdFromToken(token);
    if (!userId) return null;
    try {
      const response = await fetch(`${API_URL}/user/fav/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ Product_Id: productId })
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      return null;
    }
  }
};
