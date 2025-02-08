export default async function handler(req, res) {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ message: "File name is required" });
  }

  const fileUrl = `https://filezone-cdn.caliph.dev/file/${fileName}`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return res.status(response.status).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", response.headers.get("Content-Type"));
    res.setHeader("Content-Length", response.headers.get("Content-Length"));

    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error fetching file", error: error.message });
  }
}
