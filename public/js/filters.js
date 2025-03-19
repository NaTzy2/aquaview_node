import { displayWorksCards } from "./ui.components.js";

export const FILTER_TYPES = {
  ALL: "semua",
  POSTER: "poster",
  PAPER: "kti",
  NEWEST: "terbaru",
  OLDEST: "terlama",
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
  const currentSelected = current.querySelector(".filter__selected");
  const currentOptions = current.querySelectorAll(".filter__items");
  const currentOption = el.closest(".filter__items");

  currentSelected.innerHTML = `
    ${currentOption.textContent} 
    <i class="fa-solid fa-chevron-down"></i>
    <i class="fa-solid fa-xmark"></i>
    `;

  currentOptions.forEach((option) => option.classList.remove("active"));
  currentOption.classList.add("active");
  current.classList.remove("active");

  const option = currentOption.textContent.trim().toLowerCase();

  const filteredDatas = handleFilteredWorks(current, option, datas);

  displayWorksCards(filteredDatas);
}

export function handleFilteredWorks(current, option, datas) {
  const nextSibling = current.nextElementSibling;
  const prevSibling = current.previousElementSibling;

  let nextSelected;
  if (nextSibling) {
    nextSelected = nextSibling
      .querySelector(".filter__selected")
      .textContent.trim()
      .toLowerCase();
  }

  let prevSelected;
  if (prevSibling) {
    prevSelected = prevSibling
      .querySelector(".filter__selected")
      .textContent.trim()
      .toLowerCase();
  }

  console.log(option)

  const isByTime =
    option === FILTER_TYPES.NEWEST || option === FILTER_TYPES.OLDEST;

  let filteredDatas;
  if (!isByTime) {
    switch (option) {
      case FILTER_TYPES.ALL:
        filteredDatas = datas;

        break;
      case FILTER_TYPES.POSTER:
        filteredDatas = datas.filter((data) => data.file_type === "poster");

        break;
      case FILTER_TYPES.PAPER:
        filteredDatas = datas.filter((data) => data.file_type === "pdf");

        break;
    }

    if (nextSelected) {
      console.log("next: " + nextSelected);
      switch (nextSelected) {
        case FILTER_TYPES.NEWEST:
          filteredDatas = sortByDate(filteredDatas, true);

          break;
        case FILTER_TYPES.OLDEST:
          filteredDatas = sortByDate(filteredDatas, false);

          break;
      }
    }
  }else{
    switch (option) {
      case FILTER_TYPES.NEWEST:
        filteredDatas = sortByDate(datas, true);

        break;
      case FILTER_TYPES.OLDEST:
        filteredDatas = sortByDate(datas, false);

        break;
      default:
        console.log("How");
        break;
    }

    if (prevSelected) {
      console.log("prev: " + prevSelected);
      switch (prevSelected) {
        case FILTER_TYPES.ALL:
          filteredDatas = filteredDatas;

          break;
        case FILTER_TYPES.POSTER:
          filteredDatas = filteredDatas.filter((data) => data.file_type === "poster");

          break;
        case FILTER_TYPES.PAPER:
          filteredDatas = filteredDatas.filter((data) => data.file_type === "pdf");

          break;
      }
    }
  }

  return filteredDatas
}

export function sortByDate(datas, isDescending) {
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
