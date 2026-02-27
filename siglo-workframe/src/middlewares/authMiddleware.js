const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        // Ensure JWT secret is provided in env
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

        const decoded = jwt.verify(token, secret);

        // Inject tenantId and other info into request
        req.tenantId = decoded.tenantId;
        req.user = decoded; // Contains id, role, etc.

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired' });
        }
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
