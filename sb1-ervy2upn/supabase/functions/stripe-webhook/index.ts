import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const stripe = new Stripe(stripeSecretKey);

    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'No signature found' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the raw body
    const body = await req.text();

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Process the event
    const eventObject = event.data.object;
    console.log(`Processing event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(eventObject, supabase, stripe);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(eventObject, supabase);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});

async function handleCheckoutSessionCompleted(session: any, supabase: any, stripe: any) {
  const { customer, mode, payment_status } = session;

  if (mode === 'subscription') {
    // For subscriptions, we'll get subscription updates from other events
    console.log(`Subscription checkout completed for customer: ${customer}`);
  } else if (mode === 'payment' && payment_status === 'paid') {
    // For one-time payments, record the order
    try {
      const { id: checkout_session_id, payment_intent, amount_subtotal, amount_total, currency } = session;

      // Get payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

      // Insert the order into the database
      const { error } = await supabase.from('stripe_orders').insert({
        checkout_session_id,
        payment_intent_id: payment_intent,
        customer_id: customer,
        amount_subtotal,
        amount_total,
        currency,
        payment_status,
        status: 'completed',
      });

      if (error) {
        console.error('Error inserting order:', error);
      }
    } catch (error) {
      console.error('Error processing one-time payment:', error);
    }
  }
}

async function handleSubscriptionChange(subscription: any, supabase: any) {
  const { customer, id, status, current_period_start, current_period_end, cancel_at_period_end, items } = subscription;
  
  try {
    // Get the price ID from the first item
    const priceId = items.data[0]?.price.id;

    // Update the subscription in the database
    const { error } = await supabase.from('stripe_subscriptions').upsert({
      customer_id: customer,
      subscription_id: id,
      price_id: priceId,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      status,
      updated_at: new Date(),
    }, {
      onConflict: 'customer_id',
    });

    if (error) {
      console.error('Error updating subscription:', error);
    }
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}