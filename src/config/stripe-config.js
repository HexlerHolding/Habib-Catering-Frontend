// src/utils/stripe-config.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const publishableKey = 'pk_test_your_publishable_key';

const stripePromise = loadStripe(publishableKey);

export default stripePromise;