import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Clean up any location data from localStorage on app startup
// This ensures that address data is never persisted locally
try {
  // Remove any old location-related data
  localStorage.removeItem('selectedAddress');
  localStorage.removeItem('savedAddresses');
  
  // Clean up any location data from the main redux state
  const existingState = localStorage.getItem('reduxState');
  if (existingState) {
    const parsedState = JSON.parse(existingState);
    if (parsedState.location) {
      console.log('Cleaning up location data from localStorage on app startup');
      const { location, ...stateWithoutLocation } = parsedState;
      localStorage.setItem('reduxState', JSON.stringify(stateWithoutLocation));
    }
  }
} catch (error) {
  console.log('Error during localStorage cleanup on startup:', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)