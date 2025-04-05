let cachedFilesDatas = null;

/**
 * Fetches files data from API with caching
 * @returns {Promise<Array>} Files data
 */
export async function fetchFilesDatas() {
  if (cachedFilesDatas) return cachedFilesDatas;

  try {
    const response = await fetch("/api/files");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    cachedFilesDatas = await response.json();

    return cachedFilesDatas;
  } catch (error) {
    console.error("Error fetching files:", error);

    return [];
  }
}

export async function fetchFileByID(fileID, fileType) {
  try {
    const response = await fetch(`/api/files/${fileType}/${fileID}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);

    return null;
  }
}

export async function downloadPoster(fileID) {
  window.location.href = `api/files/download/poster/${fileID}`;
}
