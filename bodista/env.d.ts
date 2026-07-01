/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  // Project env vars on top of HydrogenEnv (Shopify vars are already typed).
  interface Env {
    /** Klaviyo private API key — server-only, never exposed to the client. */
    PRIVATE_KLAVIYO_API_KEY: string;
    /** Klaviyo public site ID (company_id) — safe for the onsite script. */
    PUBLIC_KLAVIYO_COMPANY_ID: string;
    /** Klaviyo list ID the newsletter subscribes to. */
    KLAVIYO_NEWSLETTER_LIST_ID: string;
  }
}
