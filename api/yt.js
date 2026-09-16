export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(200).json({
      status: "online",
      name: "YT Downloader API",
    });
  }

  try {
    const apiUrl = `https://multidl.kcey.workers.dev/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    return res.status(response.status).send(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
