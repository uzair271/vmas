import axios from 'axios';

export const fetchManufacturers = async () => {
  try {
    const response = await axios.get(
      'https://vpic.nhtsa.dot.gov/api/vehicles/GetWMIsForManufacturer/hon?format=json'
    );
    console.log("API Response:", response.data.Results); // Debugging API response
    return response.data.Results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array if an error occurs
  }
};
