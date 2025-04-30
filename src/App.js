import './App.css';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Layout from './layouts/Main';
import Routes from './routes/Router';

import { ThemeProvider } from '@emotion/react';
import theme from './Theme.js';

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes />
        </Layout>
      </Router>
    </ThemeProvider>
  );

};

export default App;