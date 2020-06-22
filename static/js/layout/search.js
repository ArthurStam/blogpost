import { parseQueryString } from '../utils.js';

const headerEl = document.getElementById('header');
const headerSearchToggleEl = document.getElementById('header-search-toggle');
const headerSearchControlEl = document.getElementById('header-search-control');

headerSearchToggleEl.addEventListener('click', () => {
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
  if (!e.path.includes(headerSearchToggleEl) && !e.path.includes(headerSearchControlEl)) {
    hideSearch();
    document.removeEventListener('click', onDocumentClick);
  }
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
