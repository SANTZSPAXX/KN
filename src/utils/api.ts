/**
 * Utility to resolve the correct backend API URL dynamically based on current deployment environment.
 * Enables seamless server-client communication when hosted statically on platform like Cloudflare Pages.
 */

// Production Cloud Run deployment URL for the KoreNexus backend container
const DEFAULT_PRODUCTION_BACKEND = "https://ais-pre-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app";

export function getApiUrl(path: string): string {
  // Ensure we have a leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // 1. Detection of running environment
  const hash = window.location.hostname;
  
  // If we are already running on the Cloud Run container (preview or shared)
  const isCloudRun = hash.includes("run.app") || hash.includes("webcontainer.io");
  
  // If we are developing locally on localhost
  const isLocalhost = hash === "localhost" || hash === "127.0.0.1";

  if (isCloudRun || isLocalhost) {
    // Relative paths are preferred on the actual API host; avoid cross-container CORS
    return cleanPath;
  }

  // 2. User manual override (e.g., configured in Cloudflare environment variables) for external static deployments
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_API_URL) {
    const base = metaEnv.VITE_API_URL.replace(/\/$/, "");
    return `${base}${cleanPath}`;
  }

  // 3. Static external deployment fallback (e.g. Cloudflare Pages, GitHub Pages)
  // Route all database spreadsheet and AI calls back to our active Google Cloud Run container
  return `${DEFAULT_PRODUCTION_BACKEND}${cleanPath}`;
}

/**
 * A drop-in safe wrapper for standard `fetch` designed to mimic native Response,
 * but catches all network/parsing exceptions to guarantee it never crashes
 * the client application. Resolves with a consistent structure and graceful fallbacks.
 */
export async function safeFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : getApiUrl(path);

  let response: Response | null = null;
  let textContent = "";
  let networkError: any = null;

  try {
    response = await fetch(url, options);
    textContent = await response.text();
  } catch (err: any) {
    // Failover fallback mechanism: If fetch to the Shared App container (ais-pre) fails,
    // automatically try the Active Development container (ais-dev) to keep the app resilient and operational.
    const preHost = "ais-pre-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app";
    const devHost = "ais-dev-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app";
    
    if (url.includes(preHost)) {
      const fallbackUrl = url.replace(preHost, devHost);
      console.warn(`[API Client Network Error] Primary fetch failed. Initiating automatic failover fallback from PRE to DEV container.\nTarget: ${fallbackUrl}`, err);
      try {
        response = await fetch(fallbackUrl, options);
        textContent = await response.text();
      } catch (fallbackErr: any) {
        networkError = fallbackErr;
        console.error(`[API Client Network/Fetch Error] Fallback URL also failed: ${fallbackUrl}`, fallbackErr);
      }
    } else if (url.includes(devHost)) {
      // Conversely, if we are calling dev directly (e.g. from a custom external host) and it fails,
      // we can try falling back to the production container (pre)
      const fallbackUrl = url.replace(devHost, preHost);
      console.warn(`[API Client Network Error] Dev fetch failed. Attempting failover recovery to PRE container.\nTarget: ${fallbackUrl}`, err);
      try {
        response = await fetch(fallbackUrl, options);
        textContent = await response.text();
      } catch (fallbackErr: any) {
        networkError = fallbackErr;
        console.error(`[API Client Network/Fetch Error] Fallback URL to PRE also failed: ${fallbackUrl}`, fallbackErr);
      }
    } else {
      networkError = err;
      console.error(`[API Client Network/Fetch Error] URL: ${url}`, err);
    }
  }

  // Create a simulated, crash-proof Response object conforming to the native Response API
  return {
    ok: response ? response.ok : false,
    status: response ? response.status : 0,
    statusText: response ? response.statusText : "Network Connection Error",
    headers: response ? response.headers : new Headers(),
    url: url,
    redirected: response ? response.redirected : false,
    type: response ? response.type : "error",
    body: null,
    bodyUsed: true,
    clone() { return this; },
    
    async text() {
      if (networkError) {
        return JSON.stringify({ success: false, error: networkError.message });
      }
      return textContent;
    },

    async json() {
      if (networkError) {
        return {
          success: false,
          error: `Erro de rede/conexão: ${networkError.message || "Sem resposta do servidor."}`,
          articles: [],
          monitors: [],
          stat: "error",
          config: {}
        };
      }
      if (!textContent.trim()) {
        return {};
      }
      try {
        return JSON.parse(textContent);
      } catch (parseErr: any) {
        console.error(`[API Client JSON Parse Error] URL: ${url}. Content preview:`, textContent.substring(0, 300));
        // Return a structured error object instead of throwing / crashing the app
        return {
          success: false,
          error: `Erro de formato: Resposta com formato corrompido ou inválido recebida da API.`,
          raw: textContent,
          articles: [],
          monitors: [],
          stat: "error",
          config: {}
        };
      }
    },

    async blob() { return new Blob(); },
    async arrayBuffer() { return new ArrayBuffer(0); },
    async formData() { return new FormData(); }
  } as unknown as Response;
}

