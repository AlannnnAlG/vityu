import logger from '../utils/logger.js';
import pb from '../utils/pocketbaseClient.js';

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('Missing or invalid authorization header');
	}

	const token = authHeader.substring(7);

	try {
		pb.authStore.save(token);

		if (!pb.authStore.isValid) {
			throw new Error('Invalid or expired token');
		}

		req.user = pb.authStore.record;
		next();
	} catch (error) {
		logger.error('Auth middleware error:', error.message);
		throw new Error('Authentication failed');
	}
};

const adminMiddleware = async (req, res, next) => {
	if (!req.user || req.user.role !== 'admin') {
		throw new Error('Admin access required');
	}
	next();
};

export { authMiddleware, adminMiddleware };
