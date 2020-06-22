const dateEls = document.querySelectorAll('[data-date]')

dateEls.forEach((el) => {
  const date = new Date(Number(el.dataset.date));
  const currentDate = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  let result = '';

  if (currentDate.getDate() === date.getDate()) {
    result = `Today at ${time}`;
  } else if (currentDate.getDate() - date.getDate() === 1) {
    result = `Yesterday at ${time}`;
  } else {
    result = `${date.toLocaleDateString()} at ${time}`;
  }

  el.innerHTML = result;
})
