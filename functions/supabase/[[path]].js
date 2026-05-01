export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Create target URL
  const targetUrl = new URL(request.url);
  targetUrl.hostname = "gdshvtyhhglehwwpoeph.supabase.co";

  // Replace the leading /supabase with empty string
  // Example: /supabase/rest/v1/users -> /rest/v1/users
  targetUrl.pathname = targetUrl.pathname.replace(/^\/supabase/, "");

  // Handle WebSockets (Supabase Realtime)
  const upgradeHeader = request.headers.get("Upgrade");
  if (upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
    return fetch(targetUrl.toString(), request);
  }

  // Handle normal HTTP requests
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow",
  });

  try {
    return await fetch(modifiedRequest);
  } catch (e) {
    return new Response("Proxy Error: " + e.message, { status: 500 });
  }
}
