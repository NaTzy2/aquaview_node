import { displayWorksCards } from "./ui.components.js";

export const FILTER_TYPES = {
  ALL: "semua",
  POSTER: "poster",
  PAPER: "kti",
  NEWEST: "terbaru",
  OLDEST: "terlama",
};

// Filter state to centralize filter management
export const FilterState = {
  category: FILTER_TYPES.ALL,
  sort: FILTER_TYPES.NEWEST,

  // Update filter state and return filtered data
  updateFilters(type, value, datas) {
    if (type === "category") {
      this.category = value;
    } else if (type === "sort") {
      this.sort = value;
    }

    return this.getFilteredData(datas);
  },

  // Get filtered data based on current state
  getFilteredData(datas) {
    if (!datas || !Array.isArray(datas)) return [];

    let filteredData = [...datas];

    // Apply category filter
    if (this.category !== FILTER_TYPES.ALL) {
      const fileType = this.category === FILTER_TYPES.PAPER ? "pdf" : "poster";
      filteredData = filteredData.filter((data) => data.file_type === fileType);
    }

    // Apply sort
    return sortByDate(filteredData, this.sort === FILTER_TYPES.NEWEST);
  },

  // Reset filters to default
  reset() {
    this.category = FILTER_TYPES.ALL;
    this.sort = FILTER_TYPES.NEWEST;
  },
};

export function handleWorksFilters(e, filesDatas) {
  const el = e.target;
  const currentFilter = el.closest(".filter__select");

  if (!currentFilter) return;

  if (el.closest(".filter__selected")) {
    const nextSibling = currentFilter.nextElementSibling;
    const prevSibling = currentFilter.previousElementSibling;

    handleToggleFilterActive(currentFilter, nextSibling, prevSibling);
  } else if (el.closest(".filter__items")) {
    handleOptionSelection(el, currentFilter, filesDatas);
  }
}

export function handleToggleFilterActive(current, next, prev) {
  if (!current) return;

  current.classList.toggle("active");

  if (next && next.classList.contains("active")) {
    next.classList.remove("active");
    return;
  }

  if (prev && prev.classList.contains("active")) {
    prev.classList.remove("active");
    return;
  }
}

export function handleOptionSelection(el, current, datas) {
  if (!el || !current || !datas) return;

  const currentSelected = current.querySelector(".filter__selected");
  if (!currentSelected) return;

  const currentOptions = current.querySelectorAll(".filter__items");
  const currentOption = el.closest(".filter__items");
  if (!currentOption) return;

  // Update UI
  currentSelected.innerHTML = `
    ${currentOption.textContent} 
    <i class="fa-solid fa-chevron-down"></i>
    <i class="fa-solid fa-xmark"></i>
  `;

  currentOptions.forEach((option) => option.classList.remove("active"));
  currentOption.classList.add("active");
  current.classList.remove("active");

  const option = currentOption.textContent.trim().toLowerCase();
  const isFirstFilter = !current.previousElementSibling;

  // Update filter state
  if (isFirstFilter) {
    // Category filter
    const filteredDatas = FilterState.updateFilters("category", option, datas);
    displayWorksCards(filteredDatas);
  } else {
    // Sort filter
    const filteredDatas = FilterState.updateFilters("sort", option, datas);
    displayWorksCards(filteredDatas);
  }
}

export function sortByDate(datas, isDescending) {
  if (!datas || !Array.isArray(datas)) return [];

  return [...datas].sort((a, b) => {
    const dateA = a.modified_date
      ? new Date(a.modified_date)
      : new Date(a.upload_date);
    const dateB = b.modified_date
      ? new Date(b.modified_date)
      : new Date(b.upload_date);
    return isDescending ? dateB - dateA : dateA - dateB;
  });
}
