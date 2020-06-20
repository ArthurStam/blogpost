const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

function markdownPost(post) {
  return {
    ...post,
    text: md.render(post.text)
  }
}

module.exports = {
  markdownPost,
}
