import { DOM } from "./dom.utils.js";
import { handleWorksFilters } from "./filters.js";
import { handleWorksPagination } from "./pagination.js";
import { downloadPoster, fetchFileByID } from "./script.api.js";
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

  DOM.popularContainer.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest(".card__button")) {
      handleViewWorks(e);
      return;
    }
  });
  eventListeners.push({
    element: DOM.popularContainer,
    event: "click",
    handler: handleViewWorks,
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

  DOM.worksGrid.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest(".card")) {
      handleViewWorks(e);
      return;
    }
  });
  eventListeners.push({
    element: DOM.worksGrid,
    event: "click",
    handler: handleViewWorks,
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

  DOM.moduleActionClose.addEventListener("click", handleCloseViewWorks);
  eventListeners.push({
    element: DOM.moduleActionClose,
    event: "click",
    handler: handleCloseViewWorks,
  });

  DOM.moduleActionDownload.addEventListener("click", handleDownloadPoster);
  eventListeners.push({
    element: DOM.moduleActionDownload,
    event: "click",
    handler: handleDownloadPoster,
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

  if (!el.closest(".nav__items")) return;

  const clickedItems = el.closest(".nav__items");

  if (clickedItems.classList.contains("active")) {
    if (DOM.hamburgerNav.checked) {
      DOM.hamburgerNav.checked = false;
      DOM.navBot.classList.remove("active");
    }
    return;
  }

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

  const sectionTop =
    currSection.getBoundingClientRect().top + window.pageYOffset;
  const navHeight = DOM.nav.offsetHeight;
  const scrollToPosition = sectionTop - navHeight;

  window.scrollTo({
    top: scrollToPosition,
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

export async function handleViewWorks(e) {
  const el = e.target;

  const currCard = el.closest(".card");
  const currCardID = currCard.dataset.id;
  const currCardType = currCard.dataset.type;

  history.pushState(
    {
      fileID: currCardID,
      fileType: currCardType,
    },
    "",
    `/${currCardType}/${currCardID}`
  );

  try {
    const data = await fetchFileByID(currCardID, currCardType);

    if (!data) {
      alert("Data not found");
      return;
    }

    if (data.file_type !== "poster") {
      history.replaceState({}, "", "/");
      const viewURL = `https://docs.google.com/gview?url=${encodeURIComponent(
        data.pdf_url
      )}&embedded=true`;

      const isDownload = confirm("Ingin download file ini?");
      if (isDownload) {
        window.open(data.pdf_url, "_blank");
        return;
      }

      window.open(viewURL, "_blank");
      return;
    }

    const posterImg = DOM.modulePoster.querySelector(".module__img > img");

    DOM.modulePoster.classList.add("active");
    DOM.modulePoster.setAttribute("data-id", data.id);

    posterImg.src = data.img_url;
  } catch (error) {
    console.error("Error getting file: ", error);
  }
}

export function handleCloseViewWorks() {
  if (window.location.pathname !== "/") {
    history.replaceState({}, "", "/");
  }

  const posterImg = DOM.modulePoster.querySelector(".module__img > img");

  DOM.modulePoster.classList.remove("active");
  DOM.modulePoster.setAttribute("data-id", "");

  posterImg.src = "";
}

export function handleDownloadPoster() {
  const modulePosterID = DOM.modulePoster.dataset.id

  downloadPoster(modulePosterID)

  history.replaceState({}, "", "/");
}
