import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import { Provider } from 'react-redux';
import store from '../reduxes/ConfigStore';

const Layout = ({ children }) => {
  return (
    <Provider store={store}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Nav />
        <main style={{ flex: '1 0 auto', padding: '1rem' }}>
          {children}
        </main>
        <Footer />
      </div>
    </Provider>
  );
};

export default Layout;