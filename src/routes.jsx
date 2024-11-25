import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CryptoTracker from './components/CryptoTracker';
import CryptoDetails from './components/CryptoDetails';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<CryptoTracker />} />
    <Route path="/crypto/:id" element={<CryptoDetails />} />
  </Routes>
);

export default AppRoutes;
