import { DOM } from "./dom.utils.js";
import { FilterState } from "./filters.js";
import { displayWorksCards } from "./ui.components.js";

export const PAGINATION = {
  itemPerPage: 10,
  currentPage: 1,

  // Reset pagination
  reset() {
    this.currentPage = 1;
    if (DOM.worksPageInput) {
      DOM.worksPageInput.value = this.currentPage;
    }
  },

  // Get total pages
  getTotalPages(totalItems) {
    return Math.ceil(totalItems / this.itemPerPage);
  },

  // Update pagination buttons state
  updateButtons(totalItems) {
    if (!DOM.worksPrev || !DOM.worksNext) return;

    const totalPages = this.getTotalPages(totalItems);

    // Update prev button state
    DOM.worksPrev.classList.toggle("active", this.currentPage > 1);

    // Update next button state
    DOM.worksNext.classList.toggle("active", this.currentPage < totalPages);

    // Update page input
    if (DOM.worksPageInput) {
      DOM.worksPageInput.value = this.currentPage;
      DOM.worksPageInput.max = totalPages;
    }
  },
};

export function handleWorksPagination(e, datas) {
  if (!datas || !Array.isArray(datas)) return;

  const el = e.target;
  const prevPage = el.closest(".works__prev");
  const nextPage = el.closest(".works__next");

  let pageChanged = false;

  if (prevPage) {
    if (!prevPage.classList.contains("active")) return;
    PAGINATION.currentPage--;
    pageChanged = true;
  }

  if (nextPage) {
    if (!nextPage.classList.contains("active")) return;
    PAGINATION.currentPage++;
    pageChanged = true;
  }

  if (!pageChanged) return;

  // Update page input
  if (DOM.worksPageInput) {
    DOM.worksPageInput.value = PAGINATION.currentPage;
  }

  // Update button states
  PAGINATION.updateButtons(datas.length);

  // Get filtered data based on current filters
  const filteredData = FilterState.getFilteredData(datas);

  // Get paginated data
  const paginatedData = getPaginatedData(filteredData);

  // Display cards
  displayWorksCards(paginatedData);
}

function getPaginatedData(datas) {
  if (!datas || !Array.isArray(datas)) return [];

  const start = (PAGINATION.currentPage - 1) * PAGINATION.itemPerPage;
  const end = start + PAGINATION.itemPerPage;

  return datas.slice(start, end);
}

// Handle page input changes
export function initPaginationInput(datas) {
  if (!DOM.worksPageInput) return;

  DOM.worksPageInput.addEventListener("change", () => {
    const newPage = parseInt(DOM.worksPageInput.value, 10);
    const totalPages = PAGINATION.getTotalPages(datas.length);

    if (isNaN(newPage) || newPage < 1) {
      PAGINATION.currentPage = 1;
    } else if (newPage > totalPages) {
      PAGINATION.currentPage = totalPages;
    } else {
      PAGINATION.currentPage = newPage;
    }

    DOM.worksPageInput.value = PAGINATION.currentPage;
    PAGINATION.updateButtons(datas.length);

    // Get filtered and paginated data
    const filteredData = FilterState.getFilteredData(datas);
    const paginatedData = getPaginatedData(filteredData);

    // Display cards
    displayWorksCards(paginatedData);
  });
}
