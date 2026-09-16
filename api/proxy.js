export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).json({ error: "url required" });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send("Upstream error: " + upstream.status);
    }

    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename || "download.mp4")}"`
    );

    const len = upstream.headers.get("content-length");
    if (len) res.setHeader("Content-Length", len);

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.send(buffer);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
