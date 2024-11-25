// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
}

module.exports = { isAdmin };
