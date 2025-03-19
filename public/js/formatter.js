/**
 * Formats view count with K, M, B suffixes
 * @param {number} views - Number of views
 * @returns {string} Formatted view count
 */

export function formatViews(views) {
  if (views >= 1000 && views <= 999999) {
    return (views / 1000).toFixed(1) + " K";
  }

  if (views >= 1000000 && views <= 999999999) {
    return (views / 1000000).toFixed(1) + " M";
  }

  if (views >= 1000000000) {
    return (views / 1000000000).toFixed(1) + " B";
  }

  return views.toString();
}

/**
 * Formats date according to specified format
 * @param {string} dateStr - Date string
 * @param {string} format - Format string (ddmmm or ddmmmyyyy)
 * @returns {string} Formatted date
 */

export function formatDate(dateStr, format) {
  const date = new Date(dateStr);

  switch (format) {
    case "ddmmm":
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    case "ddmmmyyyy":
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }
}

/**
 * Sanitizes HTML content to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
 export function sanitizeHTML(text) {
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
  }