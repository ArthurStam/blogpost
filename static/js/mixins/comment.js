const replyTargets = document.querySelectorAll('[data-comment-reply]');

document.addEventListener('click', (e) => {
  if (Array.prototype.includes.call(replyTargets, e.target)) {
    const comments = document.querySelectorAll('[data-comment]');
    comments.forEach((el) => {
      el.classList.remove('comment-reply');
    });

    const { commentId } = e.target.dataset;
    const commentEl = document.querySelector(`[data-comment][data-comment-id="${commentId}"]`)
    commentEl.classList.add('comment-reply');
  }
})

// replyTarget.addEventListener('click', (e) => {
//   const { commentId } = e.currentTarget.dataset;
//
//   console.log(commentId);
// })
