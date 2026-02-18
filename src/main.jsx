import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';

// Register SW with periodic update checks.
// When a pinned PWA is reopened it often resumes from memory without
// re-fetching the service worker.  We force an update check every time
// the app becomes visible again (tab/app switch) and also on a 60-second
// interval as a fallback.
const updateSW = registerSW({
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;

    // Check for updates whenever the app comes back to the foreground
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update();
      }
    });

    // Also poll every 60 s as a safety net
    setInterval(() => registration.update(), 60 * 1000);
  },
  onOfflineReady() {},
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
