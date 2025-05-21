// src/components/StripeProvider.js
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

const StripeProvider = ({ children }) => {
  const options = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap',
      },
    ],
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: '#3B82F6', // Replace with your primary color
        colorBackground: '#FFFFFF',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;