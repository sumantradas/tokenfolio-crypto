import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store/store';
import AppRoutes from './routes.jsx';

const App = () => (
  <Provider store={store}>
    <Router basename="/tokenfolio-crypto">
      <AppRoutes />
    </Router>
  </Provider>
);

export default App;
