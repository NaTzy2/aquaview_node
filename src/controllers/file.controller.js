import axios from "axios";
import { getFileByID, getFiles } from "../models/file.models.js";

export async function getAllFiles(req, res) {
  try {
    const files = await getFiles();

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to get files" });
  }
}

export async function getFile(req, res) {
  const fileID = req.params.id;

  try {
    const file = await getFileByID(fileID);

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: "Failet to get file" });
  }
}

export async function downloadFile(req, res) {
  const fileID = req.params.id;

  try {
    const file = await getFileByID(fileID);
    const { img_url, title } = file;

    if (!img_url) {
      return res.status(404).json({ error: "Image URL not available." });
    }

    const response = await axios.get(img_url, { responseType: "stream" });

    const extension = img_url.split(".").pop().split("?")[0];
    const fileName = `${title}.${extension}`;

    res.setHeader("Content-Disposition", `attachment;filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).json({ error: "Failed to download file." });
  }
}
