const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

function markdownPost(post) {
  return {
    ...post,
    text: md.render(post.text)
  }
}

function collapseComments(comments = [], parent_id = null) {
  const filteredComments = comments.filter(comment => comment.parent_id === parent_id);

  return filteredComments.map(comment => {
    return {
      ...comment,
      child: collapseComments(comments, comment.comment_id)
    }
  });
}

module.exports = {
  markdownPost,
  collapseComments,
}
