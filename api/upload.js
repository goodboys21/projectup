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
    return res.status(405).send("Method Not Allowed");
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).send("File tidak ditemukan.");
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

      // Redirect langsung ke file yang udah diproxy ke domain lo
      res.writeHead(302, { Location: proxiedUrl });
      res.end();

    } catch (error) {
      res.status(500).send("Gagal mengunggah file.");
    }
  });
  }
