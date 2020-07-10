const { query } = require('../mysql');
const { escape } = require('mysql');
const errorCodes = require('../errorCodes');

async function create({ text, user_id, post_id, parent_id }) {
  if (!text || !post_id || !user_id) {
    throw new Error(errorCodes.ERROR_CODE_COMMENTS_CREATE_VALIDATION)
  } else if (!parent_id) {
    await query(`
      INSERT comments(text, post_id, user_id) 
      VALUES (${escape(text)}, ${Number(post_id)}, ${Number(user_id)})
    `);
  } else {
    await query(`
      INSERT comments(text, post_id, user_id, parent_id) 
      VALUES (${escape(text)}, ${Number(post_id)}, ${Number(user_id)}, ${Number(parent_id)})
    `);
  }
}

async function get({ post_id }) {
  if (!post_id) {
    throw new Error(errorCodes.ERROR_CODE_COMMENTS_GET_VAlIDATION)
  } else {
    return await query(`
      SELECT c.comment_id,c.parent_id,c.text,c.created_at,u.nickname AS author,u.avatar AS authorAvatar
      FROM comments c 
      JOIN users u 
      ON u.user_id = c.user_id 
      WHERE c.post_id=${Number(post_id)}`
    );
  }
}

module.exports = {
  create,
  get,
}
