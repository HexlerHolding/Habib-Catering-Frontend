import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const makePayment = async (order) => {
    try {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/orders`, order);
        console.log('Payment response', response);
        return response;
    } catch (error) {
        console.error('Error making payment', error);
    }
}