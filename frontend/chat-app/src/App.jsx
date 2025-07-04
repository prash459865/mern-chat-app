import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginAndSignup from './Pages/LoginAndSignup/LoginAndSignup';
import MainPage from './Pages/MainPage/MainPage';
import { Toaster } from 'react-hot-toast'; 
import ProtectedUI from './Components/ProtectedUI';
import { Navigate } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<LoginAndSignup/>}/>
        <Route path='/mainPage' element={<ProtectedUI><MainPage/></ProtectedUI>}/>
      </Routes>
      <Toaster position="top-right" /> 
    </BrowserRouter>
  );
};

export default App;
