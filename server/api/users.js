const { query } = require('../mysql');
const { escape } = require('mysql');
const errorCodes = require('../errorCodes');
const md5 = require('md5');

function get({ nickname }) {
  return query(`SELECT * FROM users WHERE nickname=${escape(nickname)}`).then((results) => {
    if (!results.length) {
      throw new Error(errorCodes.ERROR_CODE_USER_NOT_FOUND)
    } else {
      return results[0];
    }
  })
}

function login({ login, password }) {
  return query(`SELECT * FROM users WHERE login=${escape(login)}`).then((results) => {
    if (!results.length) {
      throw new Error(errorCodes.ERROR_CODE_USER_NOT_FOUND);
    } else {
      const user = results[0];
      if (user.password !== password) {
        throw new Error(errorCodes.ERROR_CODE_USER_NOT_FOUND);
      } else {
        const token = md5(Date.now() + password);
        return query(`UPDATE users SET token=${escape(token)} WHERE login=${escape(login)}`).then(() => {
          return token
        })
      }
    }
  })
}

async function signup({ login, password, nickname }) {
  const sameLogin = await query(`SELECT * FROM users WHERE login=${escape(login)}`);
  if (sameLogin.length > 0) {
    throw new Error(errorCodes.ERROR_CODE_USER_ALREADY_EXIST);
  }
  const sameNickname = await query(`SELECT * FROM users WHERE nickname=${escape(nickname)}`);
  if (sameNickname.length > 0) {
    throw new Error(errorCodes.ERROR_CODE_NICKNAME_ALREADY_EXIST);
  }
  await query(`INSERT users(login, password, nickname) VALUES (${escape(login)}, ${escape(password)}, ${escape(nickname)})`);
  const token = md5(Date.now() + password);
  await query(`UPDATE users SET token=${escape(token)} WHERE login=${escape(login)}`);
  return token;
}

module.exports = {
  login,
  signup,
  get,
}
