export async function onRequest(context) {
  const { request, env } = context;
  const KV = env.PRODUK_DB;

  if (request.method === "GET") {
    const data = await KV.get("all_products", "json") || {};
    return Response.json(data);
  }

  if (request.method === "POST") {
    try {
      const data = await request.json();
      await KV.put("all_products", JSON.stringify(data));
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}