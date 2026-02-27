const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password, tenantId } = req.body;

        // In a real application, we would validate credentials against a users/employees database.
        // For phase 6 migration, we are simply issuing a token based on the provided input 
        // as a temporary mock to test the multi-tenant architecture.
        if (!username || !password || !tenantId) {
            return res.status(400).json({ success: false, error: 'Missing username, password or tenantId' });
        }

        // Mock authentication check
        if (password !== 'admin123') {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const payload = {
            userId: 1, // Mock user ID
            username: username,
            tenantId: tenantId,
            role: 'admin' // Mock role
        };

        const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
        const expiresIn = process.env.JWT_EXPIRE || '24h';

        const token = jwt.sign(payload, secret, { expiresIn });

        res.json({
            success: true,
            data: {
                token,
                user: payload
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error during login' });
    }
};
