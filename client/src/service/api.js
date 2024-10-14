import axios from 'axios';

const API_URI = 'http://localhost:8080'; // Ensure this is your API base URL

export const uploadFile = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/uploads`, data);
    return response.data;
  } catch (error) {
    console.log('Error while uploading file', error.message);
  }
};
