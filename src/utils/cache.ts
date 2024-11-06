export const clearCacheAndReload = () => {
  if ('caches' in window) {
    // Clear all caches
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
  // Reload the page
  window.location.reload();
};