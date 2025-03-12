import { getFiles } from "../models/file.models.js";

export async function getAllFiles(req, res) {
  try {
    const files = await getFiles();

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to get files" });
  }
}
