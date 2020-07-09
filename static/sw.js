self.addEventListener('fetch', function(event) {
  // Можете использовать любую стратегию описанную выше.
  // Если она не отработает корректно, то используейте `Embedded fallback`.
  event.respondWith(fetch(event.request).catch(() => useFallback()));
});

// Наш Fallback вместе с нашим собсвенным Динозавриком.
const FALLBACK = `
<html>
  <head>
    <title>BlogPost</title>
    <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no' />
  </head>
  <body>
    You are offline
  </body>
</html>
`;

// Он никогда не упадет, т.к мы всегда отдаем заранее подготовленные данные.
function useFallback() {
  return Promise.resolve(new Response(FALLBACK, { headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }}));
}
