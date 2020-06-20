const { query } = require('../mysql');
const { ERROR_CODE_USER_NOT_FOUND } = require('../errorCodes');

function authenticated(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    query(`SELECT * FROM users WHERE token='${token}'`).then((results) => {
      if (results.length) {
        req.authenticated = true;
        req.user_id = results[0].user_id;
        res.locals.authenticated = true;
        res.locals.currentUser = results[0];
        next();
      } else {
        throw new Error(ERROR_CODE_USER_NOT_FOUND);
      }
    }).catch(() => {
      req.authenticated = false;
      res.locals.authenticated = false;
      next();
    });
  } else {
    req.authenticated = false;
    res.locals.authenticated = false;
    next();
  }
}

module.exports = authenticated;
