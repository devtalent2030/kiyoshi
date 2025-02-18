const jwt = require('jsonwebtoken');

/**
 * Middleware to authorize users.
 * @param {Array<string>} [roles] - Optional list of roles allowed for the route.
 */
const authorize = (roles) => (req, res, next) => {
  const authHeader = req.headers?.authorization; // Safely access headers
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('No authorization header found in the request.');
    return res.status(401).json({ success: false, error: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header
  if (!token) {
    console.log('No token found in the authorization header.');
    return res.status(401).json({ success: false, error: 'Access Denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log('Decoded token:', decoded);

    // If roles are specified, check if the user's role is authorized
    if (roles && roles.length > 0 && (!decoded.role || !roles.includes(decoded.role))) {
      console.log(`User role '${decoded.role}' not authorized. Allowed roles: ${roles}`);
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient Permissions' });
    }

    req.user = decoded; // Attach decoded token (user details) to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error verifying token:', err.message);
    return res.status(403).json({ success: false, error: 'Invalid Token' });
  }
};

module.exports = authorize;
