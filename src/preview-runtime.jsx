import React from 'react';
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('app'));
window.addEventListener('message', (event) => {
  if (event.source !== window.parent || event.data?.type !== 'sprout-render') return;
  try {
    const exports = {};
    const require = (name) => { if (name === 'react') return React; throw new Error('This playground supports imports from react only.'); };
    const App = new Function('React', 'require', 'exports', `${event.data.code}\nreturn typeof App !== 'undefined' ? App : exports.default;`)(React, require, exports);
    if (typeof App !== 'function') throw new Error('Name your component App, or export a component as default.');
    root.render(React.createElement(App));
  } catch (error) { window.parent.postMessage({ type: 'sprout-preview-error', message: error.message }, '*'); }
});
window.addEventListener('error', (event) => window.parent.postMessage({ type: 'sprout-preview-error', message: event.message }, '*'));
window.parent.postMessage({ type: 'sprout-preview-ready' }, '*');
