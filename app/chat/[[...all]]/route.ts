import { NextRequest } from 'next/server';

// Force this route to run dynamically on Cloudflare Edge
export const runtime = 'edge';

async function handleProxy(request: NextRequest) {
  const url = new URL(request.url);
  const targetHost = 'jericrealubit-ragchatbot.hf.space';
  
  // Strip '/chat' from the path so it maps correctly to the root of your Chainlit app
  const targetPath = url.pathname.replace(/^\/chat/, '');
  
  // Make sure to preserve the clean theme view parameter we configured earlier
  const searchParams = url.search ? url.search : '?__theme=dark';
  const targetUrl = `https://${targetHost}${targetPath}${searchParams}`;

  // Clone headers and set the Host header for Hugging Face security filters
  const newHeaders = new Headers(request.headers);
  newHeaders.set('Host', targetHost);

  // Forward the request to your Hugging Face Space backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body ? request.body : undefined,
    redirect: 'manual',
  });

  return response;
}

// Map all standard HTTP methods to our proxy handler
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
