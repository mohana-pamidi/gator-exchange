import axios from 'axios';

const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
        }
    };
};

export const createRating = async (ratingData) => {
    try {
        const response = await axios.post('http://localhost:3001/api/ratings', ratingData, getConfig());
        return response.data;
    } catch (err) {
        throw err.response ? err.response.data : { msg: "Network Error" };
    }
};

export const getUserRatings = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/ratings/user/${userId}`);
        return response.data;
    } catch (err) {
throw err.response ? err.response.data : { msg: "Network Error" };    }
};

export const getItemRatings = async (listingId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/ratings/listing/${listingId}`);
        return response.data;
    } catch (err) {
        throw err.response ? err.response.data : { msg: "Network Error" };
    }
};