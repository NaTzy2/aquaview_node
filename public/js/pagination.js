import { DOM } from "./dom.utils.js";
import { FILTER_TYPES, sortByDate } from "./filters.js";
import { displayWorksCards } from "./ui.components.js";

const {ALL, NEWEST} = FILTER_TYPES

const PAGINATION = {
  itemPerPage: 10,
  currentPage: 1,
};

export function handleWorksPagination(e, datas) {
  const el = e.target;
  const prevPage = el.closest(".works__prev");
  const nextPage = el.closest(".works__next");
  const worksFilter = DOM.worksFilter
  const filterByCategory = worksFilter.querySelectorAll('.filter__selected')[0]
  const categoryOptions = filterByCategory.querySelectorAll('.filter__items')
  const filterByTime = worksFilter.querySelectorAll('.filter__selected')[1]
  const timeOptions = filterByTime.querySelectorAll('.filter__items')

  if (prevPage) {
    if (!prevPage.classList.contains("active")) return;

    PAGINATION.currentPage--;

    DOM.worksPageInput.value = PAGINATION.currentPage;

    handleUpdateActiveButton(datas.length);
  }

  if (nextPage) {
    if (!nextPage.classList.contains("active")) return;

    PAGINATION.currentPage++;

    DOM.worksPageInput.value = PAGINATION.currentPage;

    handleUpdateActiveButton(datas.length);
  }

  const updatedDatas = updateShownItem(datas)

  displayWorksCards(updatedDatas)

  const isFilterAll = filterByCategory.textContent.trim() === ALL
  const isFilterNewest = filterByTime.textContent.trim() === NEWEST
  if(isFilterAll && isFilterNewest)
    return

  filterByCategory.textContent = ALL
  handleUpdateActiveOptions(categoryOptions)
  
  filterByTime.textContent = NEWEST
  handleUpdateActiveOptions(timeOptions)
}

function handleUpdateActiveButton(length) {
  if (PAGINATION.currentPage > 1) {
    if (DOM.worksPrev.classList.contains("active")) return;
    DOM.worksPrev.classList.add("active");
  } else {
    DOM.worksPrev.classList.remove("active");
  }
  
  if (PAGINATION.currentPage * PAGINATION.itemPerPage > length) {
    DOM.worksNext.classList.remove("active");
  } else {
    if (DOM.worksNext.classList.contains("active")) return;
    DOM.worksNext.classList.add("active");
  }
}

function updateShownItem(datas)
{
  const start = (PAGINATION.currentPage - 1) * PAGINATION.itemPerPage
  const end = start + PAGINATION.itemPerPage

  return datas.slice(start, end)
}

function handleUpdateActiveOptions(options)
{
  options.forEach(option => {
    const text = option.textContent.trim()

    option.classList.remove('active')
    if(text === ALL || text === NEWEST)
    {
      option.classList.add('active')
    }
  })
}