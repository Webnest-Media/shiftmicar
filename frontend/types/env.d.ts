// Type declarations for the runtime env injected via /env.js
interface Window {
  __ENV__?: {
    API_URL?: string;
    SITE_URL?: string;
  };
}
