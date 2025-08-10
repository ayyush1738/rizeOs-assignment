import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }

        // 2. Check format "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Invalid authorization format' });
        }

        const token = parts[1];

        // 3. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Attach decoded payload to request
        req.user = decoded; // { email, id }

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
