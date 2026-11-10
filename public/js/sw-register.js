// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Check for updates
navigator.serviceWorker?.ready.then(registration => {
    registration.update();
});

// Listen for updates
navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (confirm('Update tersedia! Reload aplikasi sekarang?')) {
        window.location.reload();
    }
});
