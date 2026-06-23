import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /payment/create-checkout
router.post('/create-checkout', authMiddleware, async (req, res) => {
	const { order_id, amount, payment_method } = req.body;
	const userId = req.user.id;

	if (!order_id || !amount || !payment_method) {
		return res.status(400).json({ error: 'order_id, amount, and payment_method are required' });
	}

	if (amount <= 0) {
		return res.status(400).json({ error: 'Amount must be greater than 0' });
	}

	// Create Stripe Checkout Session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: `Order ${order_id}`,
					},
					unit_amount: Math.round(amount * 100),
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
	});

	// Create payment transaction record in PocketBase
	const transaction = await pb.collection('payment_transactions').create({
		order_id,
		user_id: userId,
		amount,
		payment_method,
		status: 'pending',
		stripe_session_id: session.id,
		created_at: new Date().toISOString(),
	});

	logger.info(`Payment checkout created: ${session.id} for order ${order_id}`);

	res.json({
		success: true,
		payment_url: session.url,
		transaction_id: transaction.id,
		session_id: session.id,
	});
});

// POST /payment/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
	const sig = req.headers['stripe-signature'];
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!webhookSecret) {
		logger.warn('Stripe webhook secret not configured');
		return res.status(400).json({ error: 'Webhook secret not configured' });
	}

	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
	} catch (error) {
		logger.error('Webhook signature verification failed:', error.message);
		return res.status(400).json({ error: 'Invalid signature' });
	}

	try {
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;

			// Find transaction by stripe_session_id
			const transaction = await pb.collection('payment_transactions').getFirstListItem(`stripe_session_id = "${session.id}"`, { requestKey: null });

			if (transaction) {
				// Update transaction status
				await pb.collection('payment_transactions').update(transaction.id, {
					status: 'completed',
					updated_at: new Date().toISOString(),
				});

				// Update order status
				const order = await pb.collection('orders').getOne(transaction.order_id, { requestKey: null });
				if (order) {
					await pb.collection('orders').update(transaction.order_id, {
						status: 'paid',
						updated_at: new Date().toISOString(),
					});
				}

				logger.info(`Payment completed for transaction ${transaction.id}`);
			}
		} else if (event.type === 'charge.failed') {
			const charge = event.data.object;

			// Find transaction by stripe_session_id (if available)
			const transaction = await pb.collection('payment_transactions').getFirstListItem(`stripe_session_id = "${charge.payment_intent}"`, { requestKey: null }).catch(() => null);

			if (transaction) {
				await pb.collection('payment_transactions').update(transaction.id, {
					status: 'failed',
					updated_at: new Date().toISOString(),
				});

				logger.info(`Payment failed for transaction ${transaction.id}`);
			}
		}
	} catch (error) {
		logger.error('Webhook processing error:', error.message);
		return res.status(500).json({ error: 'Webhook processing failed' });
	}

	res.json({ success: true });
});

// GET /payment/status/:transactionId
router.get('/status/:transactionId', authMiddleware, async (req, res) => {
	const { transactionId } = req.params;
	const userId = req.user.id;

	const transaction = await pb.collection('payment_transactions').getOne(transactionId, { requestKey: null });

	if (!transaction) {
		return res.status(404).json({ error: 'Transaction not found' });
	}

	// Verify user owns this transaction
	if (transaction.user_id !== userId && req.user.role !== 'admin') {
		throw new Error('Unauthorized access to transaction');
	}

	res.json({
		transaction_id: transaction.id,
		status: transaction.status,
		amount: transaction.amount,
		payment_method: transaction.payment_method,
		created_at: transaction.created_at,
		updated_at: transaction.updated_at,
	});
});

export default router;
