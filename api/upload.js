import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ success: false, message: "File tidak ditemukan." });
    }

    try {
      const fileStream = fs.createReadStream(files.file.filepath);
      const formData = new FormData();
      formData.append("file", fileStream, files.file.originalFilename);

      const response = await axios.post("https://filezone-api.caliph.dev/upload", formData, {
        headers: { ...formData.getHeaders() },
      });

      const uploadedFile = response.data.result;
      const proxiedUrl = `https://projectup.vercel.app/api/file?fileName=${uploadedFile.originalname}`;

      res.json({
        success: true,
        message: "File berhasil diunggah.",
        url: proxiedUrl,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengunggah file.",
        error: error.message,
      });
    }
  });
}
