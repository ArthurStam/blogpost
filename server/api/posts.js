const { query } = require('../mysql');
const { escape } = require('mysql');
const errorCodes = require('../errorCodes');

async function create({ title, text, user_id }) {
  let results;
  if (user_id) {
    results = await query(`INSERT posts(title, text, user_id) VALUES (${escape(title)}, ${escape(text)}, ${user_id})`);
  } else {
    results = await query(`INSERT posts(title, text) VALUES (${escape(title)}, ${escape(text)})`);
  }
  return results.insertId;
}

async function get({ user_id } = {}) {
  let request = 'SELECT p.post_id,p.text,p.title,u.nickname AS author FROM posts p LEFT JOIN users u ON p.user_id=u.user_id'
  if (user_id) {
    request += ` WHERE u.user_id=${user_id}`;
  }
  return await query(request);
}

async function getById({ post_id }) {
  const results = await query(`SELECT p.post_id,p.text,p.title,u.nickname AS author FROM posts p LEFT JOIN users u ON p.user_id=u.user_id WHERE p.post_id=${post_id}`);
  if (results.length > 0) {
    return results[0];
  } else {
    throw new Error(errorCodes.ERROR_CODE_POST_NOT_FOUND)
  }
}

module.exports = {
  create,
  get,
  getById,
}