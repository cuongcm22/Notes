const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authServer = async (req, res, next) => {
  try {
    let token = null

    const cookie = req.headers.cookie;
    const cookieArray = cookie.split("; ");
    cookieArray.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'token') {
        token = value;
      }
    });
    console.log(token);
    if (!token) {
      console.log('Chek');
      return res.redirect('/api/v1/auth/signin')
    }
    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user data to request object
    req.usersession = decoded;
    next();

  } catch (error) {
    console.error('JWT Error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authServer;

