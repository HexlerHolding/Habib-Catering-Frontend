import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getTax = async () => {
    try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/tax`);
        const GST = response.data.find(tax => tax.name === "POS_GST");
        return GST.value;
    } catch (error) {
        console.error('Error fetching tax', error);
    }
}