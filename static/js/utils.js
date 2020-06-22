export function parseQueryString(string) {
  return string.replace('?', '').split('&').reduce((acc, item) => {
    const [key, value] = item.split('=');
    acc[key] = value;
    return acc;
  }, {})
}
