export async function onRequest(context) {
  const { request, env } = context;
  const KV = env.PRODUK_DB;
  const url = new URL(request.url);
  const username = url.searchParams.get("u");

  if (!username) return new Response("User Required", { status: 400 });

  const STORAGE_KEY = `products_${username}`;

  if (request.method === "GET") {
    const data = await KV.get(STORAGE_KEY, "json") || {};
    return Response.json(data);
  }

  if (request.method === "POST") {
    try {
      const data = await request.json();
      await KV.put(STORAGE_KEY, JSON.stringify(data));
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ success: false }, { status: 500 });
    }
  }
}
