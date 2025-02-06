import axios from 'axios';

const API_URL = 'http://localhost:5165/api/auth'; //BACKEND URL

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const signup = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { username, email, password });
    return response.data;
  } catch (error) {
    throw new Error('Signup failed');
  }
}; 