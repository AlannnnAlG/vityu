import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
	const { nama_lengkap, email, password, password_confirm } = req.body;

	// Validation
	if (!nama_lengkap || !email || !password || !password_confirm) {
		return res.status(400).json({ error: 'All fields are required' });
	}

	if (password.length < 8) {
		return res.status(400).json({ error: 'Password must be at least 8 characters' });
	}

	if (password !== password_confirm) {
		return res.status(400).json({ error: 'Passwords do not match' });
	}

	// Check if email already exists
	const existingUser = await pb.collection('users').getFirstListItem(`email = "${email}"`, { requestKey: null }).catch(() => null);
	if (existingUser) {
		return res.status(400).json({ error: 'Email already registered' });
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create user in PocketBase
	const user = await pb.collection('users').create({
		email,
		password: hashedPassword,
		passwordConfirm: hashedPassword,
		nama_lengkap,
		role: 'user',
	});

	logger.info(`User registered: ${email}`);

	res.status(201).json({
		success: true,
		message: 'Registrasi berhasil',
		user: {
			id: user.id,
			email: user.email,
			nama_lengkap: user.nama_lengkap,
		},
	});
});

// POST /auth/login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	// Authenticate with PocketBase
	const authData = await pb.collection('users').authWithPassword(email, password);

	if (!authData || !authData.token) {
		throw new Error('Authentication failed');
	}

	const user = authData.record;

	logger.info(`User logged in: ${email}`);

	res.json({
		success: true,
		message: 'Login berhasil',
		user: {
			id: user.id,
			email: user.email,
			nama_lengkap: user.nama_lengkap,
			role: user.role,
		},
		token: pb.authStore.token,
	});
});

// POST /auth/logout
router.post('/logout', (req, res) => {
	pb.authStore.clear();
	logger.info('User logged out');

	res.json({
		success: true,
		message: 'Logout berhasil',
	});
});

// GET /auth/me
router.get('/me', authMiddleware, async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new Error('User not authenticated');
	}

	res.json({
		id: user.id,
		email: user.email,
		nama_lengkap: user.nama_lengkap,
		role: user.role,
	});
});

export default router;
