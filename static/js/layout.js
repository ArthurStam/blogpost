const headerEl = document.getElementById('header');
const searchToggleEl = document.getElementById('header-search-toggle');
const headerSearchControlEl = document.getElementById('header-search-control');

searchToggleEl.addEventListener('click', () => {
  headerEl.classList.add('header-search');
  document.getElementById('header-search-control').focus();
  document.addEventListener('click', onDocumentClick);
});

document.getElementById('header-search-cancel').addEventListener('click', () => {
  hideSearch();
});

headerSearchControlEl.addEventListener('keyup', (e) => {
  if (e.keyCode === 27) {
    hideSearch();
  }
})

function onDocumentClick(e) {
  if (!e.path.includes(searchToggleEl)) {
    hideSearch();
    document.removeEventListener('click', onDocumentClick);
  }
}

function parseQueryString(string) {
  return string.replace('?', '').split('&').reduce((acc, item) => {
    const [key, value] = item.split('=');
    acc[key] = value;
    return acc;
  }, {})
}

function hideSearch() {
  const query = parseQueryString(window.location.search);
  if (query.search) {
    window.location.href = '/';
  } else {
    headerSearchControlEl.value = '';
    headerEl.classList.remove('header-search');
  }
}
