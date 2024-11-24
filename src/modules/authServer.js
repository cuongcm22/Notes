const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/models.js');

dotenv.config();

// Utility function for redirecting after alert
function handleAlertWithRedirectPage(alertString, redirect) {
  return `<script>
    alert('${alertString}')
    window.location.assign(window.location.origin  + '${redirect}');
  </script>`
}

// Middleware to authenticate JWT token
module.exports.authenToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).send(handleAlertWithRedirectPage('You need to log in to access this page.', '/user/login'));
    }

    const cookiesArray = cookies.split("; ");
    let sessionToken = null;

    cookiesArray.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'token') {
        sessionToken = value;
      }
    });

    if (!sessionToken) {
      return res.status(401).send(handleAlertWithRedirectPage('You need to log in to access this page.', '/user/login'));
    }

    jwt.verify(sessionToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedData) => {
      if (err) {
        return res.status(401).send(handleAlertWithRedirectPage('Invalid token or token expired.', '/user/login'));
      }

      // If the token is valid, get user details
      const user = await User.findOne({ email: decodedData.email }, { __v: 0, password: 0 });
      req.userId = user;

      next(); // Token is valid, proceed to next middleware or route
    });
  } catch (error) {
    return res.status(401).send(handleAlertWithRedirectPage('Authentication failed.', '/user/login'));
  }
};
