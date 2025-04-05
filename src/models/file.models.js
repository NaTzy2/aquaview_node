import { supabase } from "../supabase.client.js";
import dotenv from "dotenv";

dotenv.config();

export async function getFiles() {
  const { data, error } = await supabase.from("files").select("*");

  if (error) {
    console.error("Supabase error: ", error);
    throw error;
  }

  return data.map((file) => {
    const isPDF = file.file_type === "pdf" ? true : false;

    if (isPDF) {
      file.img_url = file.img_url || process.env.PDF_PLACEHOLDER_ICON;
    }

    return file;
  });
}

export async function getFileByID(fileID) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileID)
    .single();

  if (error) {
    console.error(
      `Supabase error: Failed to get file with ID ${fileID}: `,
      error
    );
    throw error;
  }

  return data;
}
