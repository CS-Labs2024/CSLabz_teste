import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the public key
const stripePromise = loadStripe('pk_live_51QjroWRuQ4kDNGWRBFP7Cto1F2UHqh1CLEyGwazxgT82y3uyR2cImfG5Xk1eVEl024Io3veJrImEVUoqZ2KgFx8I00zyvwsKUv');

export { stripePromise };