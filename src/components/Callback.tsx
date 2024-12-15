import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      setTimeout(() => {
        navigate('/home');
      }, 250);
    } else {
      // Handle error or redirect to login
      console.error('Token not found');
      navigate('/login');
    }
  }, [navigate]);

  return null; // No UI needed
};

export default Callback; 