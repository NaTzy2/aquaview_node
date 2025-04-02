import { DOM } from "./dom.utils.js";
import { handleWorksFilters } from "./filters.js";
import { handleWorksPagination } from "./pagination.js";
import { debounce } from "./utils.js";

// Store event listeners for potential cleanup
const eventListeners = [];

/**
 * Attach all event listeners
 * @param {Array} datas - Files data
 */
export function attachEventListeners(datas) {
  const filesDatas = datas;

  // Debounced scroll handler for better performance
  const debouncedScrollHandler = debounce(handleToggleNavScrolled, 100);
  window.addEventListener("scroll", debouncedScrollHandler);
  eventListeners.push({
    element: window,
    event: "scroll",
    handler: debouncedScrollHandler,
  });

  DOM.hamburgerNav.addEventListener("change", handleToggleAsideNav);
  eventListeners.push({
    element: DOM.hamburgerNav,
    event: "change",
    handler: handleToggleAsideNav,
  });

  DOM.navBot.addEventListener("click", handleToggleNavLinks);
  eventListeners.push({
    element: DOM.navBot,
    event: "click",
    handler: handleToggleNavLinks,
  });

  const worksFilterHandler = (e) => handleWorksFilters(e, filesDatas);
  DOM.worksFilter.addEventListener("click", worksFilterHandler);
  eventListeners.push({
    element: DOM.worksFilter,
    event: "click",
    handler: worksFilterHandler,
  });

  DOM.worksSearch.addEventListener("click", handleToggleWorksSearch);
  eventListeners.push({
    element: DOM.worksSearch,
    event: "click",
    handler: handleToggleWorksSearch,
  });

  const worksPrevHandler = (e) => handleWorksPagination(e, filesDatas);
  DOM.worksPrev.addEventListener("click", worksPrevHandler);
  eventListeners.push({
    element: DOM.worksPrev,
    event: "click",
    handler: worksPrevHandler,
  });

  
  const worksNextHandler = (e) => handleWorksPagination(e, filesDatas);
  DOM.worksNext.addEventListener("click", worksNextHandler);
  eventListeners.push({
    element: DOM.worksNext,
    event: "click",
    handler: worksNextHandler,
  });
}

/**
 * Clean up all event listeners
 */
export function removeEventListeners() {
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  // Clear the array
  eventListeners.length = 0;
}

export function handleToggleNavScrolled() {
  if (!DOM.nav) return;

  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    DOM.nav.classList.add("scrolled");
  } else {
    DOM.nav.classList.remove("scrolled");
  }
}

export function handleToggleAsideNav() {
  if (!DOM.navBot || !DOM.hamburgerNav) return;
  DOM.navBot.classList.toggle("active", DOM.hamburgerNav.checked);
}

export function handleToggleNavLinks(e) {
  if (!DOM.nav || !DOM.navBot || !DOM.hamburgerNav || !DOM.navBotItems) return;

  const el = e.target;
  const navHeight = DOM.nav.offsetHeight;

  if (!el.closest(".nav__items")) return;

  const clickedItems = el.closest(".nav__items");
  const sections = {
    populer: ".popular-section",
    "karya kami": ".works-section",
  };

  const sectionName = clickedItems.textContent.toLowerCase();
  const sectionClass = sections[sectionName];

  if (!sectionClass) return;

  const currSection = document.querySelector(sectionClass);
  if (!currSection) {
    console.warn(`Section ${sectionClass} not found`);
    return;
  }

  window.scrollTo({
    top: currSection.offsetTop - navHeight,
    behavior: "smooth",
  });

  DOM.navBotItems.forEach((item) => item.classList.remove("active"));
  clickedItems.classList.add("active");

  if (DOM.hamburgerNav.checked) {
    DOM.hamburgerNav.checked = false;
    DOM.navBot.classList.remove("active");
  }
}

export function handleToggleWorksSearch(e) {
  if (!DOM.worksSearch || !DOM.worksFilter) return;

  const el = e.target;

  if (el.closest(".fa-xmark")) {
    DOM.worksSearch.classList.remove("active");
    DOM.worksFilter.style.display = "flex";
    return;
  }

  if (el.closest(".works__search") || el.closest(".fa-magnifying-glass")) {
    if (DOM.worksSearch.classList.contains("active")) return;

    const activeFilters = DOM.worksFilter.querySelectorAll(".filter__select");
    activeFilters.forEach((filter) => filter.classList.remove("active"));

    DOM.worksFilter.style.display = "none";
    DOM.worksSearch.classList.add("active");

    // Focus search input for better UX
    if (DOM.worksSearchInput) {
      setTimeout(() => DOM.worksSearchInput.focus(), 0);
    }

    return;
  }
}
