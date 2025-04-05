import { DOM } from "./dom.utils.js";
import { formatDate, formatViews, sanitizeHTML } from "./formatter.js";
import { sortByDate } from "./filters.js";
import { createElementFromHTML } from "./utils.js";
import { PAGINATION } from "./pagination.js";

/**
 * Displays popular works in the popular section
 * @param {Array} datas - Files data
 */
export function displayPopularWorks(datas) {
  if (!datas || !Array.isArray(datas) || !DOM.popularContainer) return;

  const popularDatas = [...datas]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 7);

  createPopularCards(popularDatas);
}

/**
 * Displays all works with newest first
 * @param {Array} datas - Files data
 */
export function displayAllWorks(datas) {
  if (!datas || !Array.isArray(datas) || !DOM.worksGrid) return;

  const sortedDatas = sortByDate(datas, true).slice(0, PAGINATION.itemPerPage);

  // Initialize pagination
  if (DOM.worksPrev && DOM.worksNext) {
    DOM.worksPrev.classList.remove("active"); // First page
    DOM.worksNext.classList.toggle(
      "active",
      datas.length > PAGINATION.itemPerPage
    );
  }

  if (DOM.worksPageInput) {
    DOM.worksPageInput.value = 1;
    DOM.worksPageInput.max = Math.ceil(datas.length / PAGINATION.itemPerPage);
  }

  displayWorksCards(sortedDatas);
}

/**
 * Creates cards for popular works using document fragment
 * @param {Array} datas - Popular files data
 */
export function createPopularCards(datas) {
  if (!datas || !Array.isArray(datas) || !DOM.popularContainer) return;

  const container = DOM.popularContainer;
  container.innerHTML = "";

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();

  datas.forEach((data) => {
    const {
      id,
      title,
      file_type,
      view_count,
      upload_date,
      modified_date,
      img_url,
    } = data;

    const cardDate = modified_date || upload_date;
    const cardTag = file_type === "pdf" ? "kti" : "poster";

    // Create HTML string
    const cardHTML = `
    <div class="card" data-id="${sanitizeHTML(id)}" data-type="${sanitizeHTML(
      cardTag
    )}">
      <div class="card__img">
        <img src="${sanitizeHTML(img_url)}" alt="${sanitizeHTML(title)}" />
      </div>

      <div class="card__views">
        <i class="fa-solid fa-eye"></i> 
        ${formatViews(view_count)}
      </div>

      <div class="card__content">
        <p class="card__title">${sanitizeHTML(title)}</p>
        <div class="card__info">
          <span class="card__tag ${sanitizeHTML(cardTag)}">
            <p>${sanitizeHTML(cardTag)}</p>
          </span>

          <span class="dot"></span>

          <p class="card__date">${formatDate(cardDate, "ddmmmyyyy")}</p>
        </div>
        <button class="card__button">Lihat</button>
      </div>
    </div>`;

    // Convert HTML to DOM elements and append to fragment
    const cardElement = createElementFromHTML(cardHTML);
    fragment.appendChild(cardElement);
  });

  // Append all cards at once for better performance
  container.appendChild(fragment);
}

/**
 * Creates cards for works in the grid using document fragment
 * @param {Array} datas - Files data
 */
export function displayWorksCards(datas) {
  if (!datas || !Array.isArray(datas) || !DOM.worksGrid) return;

  const container = DOM.worksGrid;
  container.innerHTML = "";

  if (datas.length === 0) {
    return;
  }

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();

  datas.forEach((data) => {
    const { id, file_type, upload_date, modified_date, img_url, title } = data;

    const cardDate = modified_date || upload_date;
    const cardTag = file_type === "pdf" ? "kti" : "poster";

    // Create HTML string
    const cardHTML = `
    <div class="card" data-id="${sanitizeHTML(id)}" data-type="${sanitizeHTML(
      cardTag
    )}">
      <div class="card__img">
        <img src="${sanitizeHTML(img_url)}" alt="${sanitizeHTML(title)}" />
      </div>

      <span class="card__date">
        <p>${formatDate(cardDate, "ddmmm")}</p>
      </span>

      <span class="card__tag ${sanitizeHTML(cardTag)}">
        <p>${sanitizeHTML(cardTag)}</p>
      </span>
    </div>`;

    // Convert HTML to DOM elements and append to fragment
    const cardElement = createElementFromHTML(cardHTML);
    fragment.appendChild(cardElement);
  });

  // Append all cards at once for better performance
  container.appendChild(fragment);
}

