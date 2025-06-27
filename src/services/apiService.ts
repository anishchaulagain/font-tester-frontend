import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/v1/fonts');
    console.log('Data:', response.data);
    return response
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};