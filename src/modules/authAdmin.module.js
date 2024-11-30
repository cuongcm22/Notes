const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authAdmin = async (req, res, next) => {
  try {
    let token = null

    const cookie = req.headers.cookie;
    const cookieArray = cookie.split("; ");
    cookieArray.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'config') {
        token = value;
      }
    });
    
    if (!token) {
      
      return res.redirect('/api/v1/auth/signin')
    }
    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decoded);

    next()

  } catch (error) {

    return res.redirect('/api/v1/auth/signin')
  }
};

module.exports = authAdmin;

