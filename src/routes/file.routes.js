import express from "express";
import {
  downloadFile,
  getAllFiles,
  getFile,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/", getAllFiles);
router.get("/:type/:id", getFile);
router.get("/download/poster/:id", downloadFile);

export default router;
