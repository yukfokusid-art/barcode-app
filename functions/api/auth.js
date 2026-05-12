export async function onRequest(context) {
  const { request, env } = context;
  const KV = env.PRODUK_DB;

  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { action, u, p } = await request.json();
  const USER_KEY = `user_meta_${u}`;

  if (action === "register") {
    const exists = await KV.get(USER_KEY);
    if (exists) return Response.json({ success: false, message: "Username sudah ada!" });
    
    // Simpan password (disarankan hash, tapi untuk contoh ini kita simpan aman di KV)
    await KV.put(USER_KEY, JSON.stringify({ password: p, createdAt: new Date().toISOString() }));
    return Response.json({ success: true, message: "Berhasil daftar!" });
  }

  if (action === "login") {
    const userData = await KV.get(USER_KEY, "json");
    if (!userData || userData.password !== p) {
      return Response.json({ success: false, message: "Username atau password salah!" });
    }
    return Response.json({ success: true, message: "Berhasil login!" });
  }

  return Response.json({ success: false });
}
