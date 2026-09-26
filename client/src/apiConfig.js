// Determine whether the app is currently running on localhost in the user's browser
const isLocalhost = Boolean(
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '[::1]' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))
);

let API_BASE_URL = '';

if (typeof window !== 'undefined') {
  if (isLocalhost) {
    // When running locally in browser, communicate with local backend port 3036
    API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3036';
  } else {
    // When deployed (e.g. on Vercel, Render, custom domain):
    // If an explicit remote backend URL was supplied at build time (and is NOT localhost), use it.
    // Otherwise, default to '' (empty string), which lets the browser make relative requests (/api/...)
    // to the same domain (e.g. handled by Vercel serverless functions / rewrites).
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      API_BASE_URL = envUrl.replace(/\/+$/, '');
    } else {
      API_BASE_URL = '';
    }
  }
} else {
  API_BASE_URL = process.env.REACT_APP_API_URL || '';
}

export default API_BASE_URL;

