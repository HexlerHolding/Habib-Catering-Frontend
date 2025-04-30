import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getProducts = async () => {
    try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/products`);
        const updatedData = response.data.map((product,index) => ({
            id: index,
            name: product.Name,
            description: product.Description,
            price: product.Price,
            category: product.Category,
            image: `${REACT_APP_BACKEND_URL}/uploads/${product.Image}`,
            isFavorite: false
        }));
        return updatedData;
    } catch (error) {
        console.error('Error fetching products', error);
    }
}