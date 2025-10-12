// Restrict admin access only to intranet

const ipWhitelist = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    const allowedRanges = [
        '10.', 
        '127.0.0.1', 
        '::1', 
    ];

    const isAllowed = allowedRanges.some(range => clientIp.includes(range));

    if (!isAllowed) {
        console.log(`[SECURITY] Blocked admin access from IP: ${clientIp}`);
        return res.status(403).json({
            error: 'Access denied. Admin panel is only accessible from campus network.'
        });
    }

    next();
};

module.exports = ipWhitelist;
