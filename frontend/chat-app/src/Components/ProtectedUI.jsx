import React, { useEffect, useState } from 'react';
import { useApi } from '../contexts/context';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ProtectedUI = ({ children }) => {
  const { baseURL } = useApi();
  const [isauth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/uiValidation`, {
          withCredentials: true,
        });
        setIsAuth(response.data.authorized); 
      } catch (error) {
        setIsAuth(false); 
      }
    };
    checkAuth();
  }, [baseURL]);

  if (isauth === null) return <div>Loading...</div>;
  if (!isauth) return <Navigate to="/login" />;

  return children;
};

export default ProtectedUI;
