const isLocalhost = Boolean(
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '[::1]' ||
   window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))
);

// On Vercel / production, default to empty string so requests go to the same domain relative path (/api/...)
const API_BASE_URL = process.env.REACT_APP_API_URL || (isLocalhost ? 'http://localhost:3036' : '');

export default API_BASE_URL;
