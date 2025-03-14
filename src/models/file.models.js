import { supabase } from "../supabase.client.js";

export async function getFiles() {
  const { data, error } = await supabase.from("files").select("*");

  if (error) {
    console.error("Supabase error: ", error);
    throw error;
  }

  const updatePromise = data.map(async (file) => {
    const { file_type, pdf_url, img_url, id } = file;

    let isPDF = file_type === "pdf" && !img_url;
    if (isPDF) {
      const pdfThumbnail =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/file-earmark-pdf.svg";

      file.img_url = pdfThumbnail;

      const { error: updateError } = await supabase
        .from("files")
        .update({ img_url: pdfThumbnail })
        .eq("id", id);

      if (updateError) {
        console.error(`Failed to update icon for file ${id}: `, updateError);
      }
    }
  });

  await Promise.all(updatePromise);

  return data;
}