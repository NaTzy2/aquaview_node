/**
 * Debounces function calls to improve performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a DOM element from HTML string
 * @param {string} html - HTML string
 * @returns {DocumentFragment} Document fragment with created elements
 */
export function createElementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content;
}
