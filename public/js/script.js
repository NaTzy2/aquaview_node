import { setUpDomEl } from "./dom.utils.js";
import { fetchFilesDatas } from "./script.api.js";
import { attachEventListeners, removeEventListeners } from "./event.handler.js";
import { displayPopularWorks, displayAllWorks } from "./ui.components.js";
import { initPaginationInput } from "./pagination.js";
import { FilterState } from "./filters.js";
import { PAGINATION } from "./pagination.js";

/**
 * Initialize application
 */
async function initApp() {
  try {
    // Fetch data
    const filesDatas = await fetchFilesDatas();

    if (!filesDatas || filesDatas.length === 0) {
      alert("Failed to get the datas");
      return;
    }

    // Set up DOM elements
    if (!setUpDomEl()) {
      alert("Failed to initialized the application");
      return;
    }

    // Reset state
    FilterState.reset();
    PAGINATION.reset();

    // Set up events
    removeEventListeners(); // Clean up any existing listeners
    attachEventListeners(filesDatas);
    initPaginationInput(filesDatas);

    // Display content
    displayPopularWorks(filesDatas);
    displayAllWorks(filesDatas);
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);

// Re-initialize on page visibility change (for better PWA support)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Only re-fetch if we've been hidden for a while
    const lastActiveTime = window.lastActiveTime || 0;
    const now = Date.now();
    if (now - lastActiveTime > 300000) {
      // 5 minutes
      initApp();
    }
  } else {
    window.lastActiveTime = Date.now();
  }
});
