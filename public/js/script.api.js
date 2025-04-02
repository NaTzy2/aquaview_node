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
    
    return []; // Return empty array instead of object for consistency
  }
}