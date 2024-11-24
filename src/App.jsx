import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import CryptoTracker from './components/CryptoTracker';
import CryptoDetails from './components/CryptoDetails';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<CryptoTracker />} />
          <Route path="/crypto/:id" element={<CryptoDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;