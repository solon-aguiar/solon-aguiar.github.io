if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
    }, function(error) {
      console.error('failed to register serviceWorker', error);
    });
  });
}