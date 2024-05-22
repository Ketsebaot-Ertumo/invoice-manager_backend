const jwt = require('jsonwebtoken');


// check the user authenticated
exports.isAuthenticated = async (req, res, next) => {
  let token;

  // Check if the token is provided in the cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Token provided in the Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "You must log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error!', error: error.message });
  }
};

  

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' ) {
        return res.status(401).json({success: false, message: "Access denied, You must log as an admin." });
    }
    next();
}


exports.isUser = (req, res, next) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin' ) {
        return res.status(401).json({success: false, message: "Access denied, You must log as a user/admin." });
    }
    next();
}

