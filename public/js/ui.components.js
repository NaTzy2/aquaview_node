import { DOM } from "./dom.utils.js";
import { formatDate, formatViews } from "./formatter.js";
import { sortByDate } from "./filters.js";

/**
 * Displays popular works in the popular section
 * @param {Array} datas - Files data
 */

export function displayPopularWorks(datas) {
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
  const sortedDatas = sortByDate(datas, true).slice(0,10);
  

  displayWorksCards(sortedDatas);
}

/**
 * Creates cards for popular works
 * @param {Array} datas - Popular files data
 */

export function createPopularCards(datas) {
  const container = DOM.popularContainer;
  container.innerHTML = "";

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

    container.innerHTML += `
    <div class="card" data-id="${id}" data-type="${cardTag}">
      <div class="card__img">
        <img src="${img_url}" alt="${title}" />
      </div>

      <div class="card__views">
        <i class="fa-solid fa-eye"></i> 
        ${formatViews(view_count)}
      </div>

      <div class="card__content">
        <p class="card__title">${title}</p>
        <div class="card__info">
          <span class="card__tag ${cardTag}">
            <p>${cardTag}</p>
          </span>

          <span class="dot"></span>

          <p class="card__date">${formatDate(cardDate, "ddmmmyyyy")}</p>
        </div>
        <button class="card__button">Lihat</button>
      </div>
    </div>
    `;
  });
}

/**
 * Creates cards for works in the grid
 * @param {Array} datas - Files data
 */

export function displayWorksCards(datas) {
  const container = DOM.worksGrid;
  container.innerHTML = "";

  datas.forEach((data) => {
    const { id, file_type, upload_date, modified_date, img_url, title } = data;

    const cardDate = modified_date || upload_date;
    const cardTag = file_type === "pdf" ? "kti" : "poster";

    container.innerHTML += `
    <div class="card" data-id="${id}" data-type="${cardTag}">
      <div class="card__img">
        <img src="${img_url}" alt="${title || "Work image"}" />
      </div>

      <span class="card__date">
        <p>${formatDate(cardDate, "ddmmm")}</p>
      </span>

      <span class="card__tag ${cardTag}">
        <p>${cardTag}</p>
      </span>
    </div>
    `;
  });
}
