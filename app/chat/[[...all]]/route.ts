import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function handleProxy(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const targetHost = "jericrealubit-ragchatbot.hf.space";

    // Cleanly rewrite the path to hit the root of your Hugging Face space
    const targetPath = url.pathname.replace(/^\/chat/, "") || "/";

    // Explicitly enforce the dark embed theme configuration parameter
    const targetUrl = new URL(targetPath, `https://${targetHost}`);
    targetUrl.search = url.search || "?__theme=dark";

    // Clone headers cleanly for the outbound fetch request
    const newHeaders = new Headers();
    request.headers.forEach((value, key) => {
      // Skip strict connection headers that confuse proxy streams
      if (!["host", "connection", "upgrade"].includes(key.toLowerCase())) {
        newHeaders.set(key, value);
      }
    });
    newHeaders.set("Host", targetHost);

    // Prepare safe fetch options based on HTTP method
    const method = request.method;
    const hasBody = !["GET", "HEAD"].includes(method) && request.body;

    const response = await fetch(targetUrl.toString(), {
      method,
      headers: newHeaders,
      body: hasBody ? request.body : undefined,
      redirect: "manual",
    });

    // Extract response headers
    const responseHeaders = new Headers(response.headers);

    // Return the clean response object straight back to the user's browser
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Edge Proxy Failure:", error);
    return new NextResponse(`Proxy routing failed: ${error.message}`, {
      status: 500,
    });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const OPTIONS = handleProxy;
