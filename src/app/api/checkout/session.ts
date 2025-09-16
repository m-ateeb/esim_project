// pages/api/checkout/session.ts

//create a Stripe PaymentIntent and draft order


// import { NextApiRequest, NextApiResponse } from 'next';
// import Stripe from 'stripe';
// import { createClient } from '@supabase/supabase-js';


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// if (req.method !== 'POST') return res.status(405).end();
// const { planId, quantity = 1, coupon } = req.body;
// const userId = req.headers['x-user-id'] as string; // or get from session


// // fetch plan
// const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single();
// if (!plan) return res.status(404).json({ error: 'plan not found' });


// const amount = plan.retail_price_cents * quantity;


// // create local order (status: pending_payment)
// const { data: order } = await supabase.from('orders').insert([{ user_id: userId, status: 'pending_payment', total_cents: amount, currency: plan.currency }]).select('*').single();


// // create Stripe PaymentIntent
// const paymentIntent = await stripe.paymentIntents.create({
// amount,
// currency: plan.currency,
// metadata: { order_id: order.id },
// automatic_payment_methods: { enabled: true }
// });


// return res.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
// }