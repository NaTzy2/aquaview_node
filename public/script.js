const nav = document.querySelector("nav");
const hamburger_nav = document.getElementById("hamburger_nav");
const nav_bot = document.querySelector(".bot-nav");
const nav_bot_items = nav_bot.querySelectorAll(".nav__items");
const works_filter = document.querySelector(".works__filter");
const works_search = document.querySelector(".works__search");
const works_search_input = document.getElementById("works_search_input");

// event listeners
document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("scroll", handleToggleNavScrolled);
  hamburger_nav.addEventListener("change", handleToggleAsideNav);
  nav_bot.addEventListener("click", handleToggleNavLinks);
  works_filter.addEventListener("click", handleWorksFilter);
  works_search.addEventListener("click", handleToggleWorksSearch);

  try {
    const response = await fetch("/api/files");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const filesData = await response.json();

    readFilesData(filesData);
  } catch (error) {
    console.error("Error fetching files: ", error);
  }
});
// end of event listeners

// functions
function handleToggleNavScrolled() {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

function handleToggleAsideNav() {
  if (hamburger_nav.checked) {
    nav_bot.classList.add("active");
  } else {
    nav_bot.classList.remove("active");
  }
}

function handleToggleNavLinks(e) {
  const el = e.target;

  if (el.closest(".nav__items")) {
    const clickedItems = el.closest(".nav__items");

    // e.preventDefault();
    let sectionClass = "";
    switch (el.textContent) {
      case "populer":
        sectionClass = ".popular-section";
        break;
      case "karya kami":
        sectionClass = ".works-section";
        break;
      default:
        break;
    }

    const currSection = document.querySelector(sectionClass);

    window.scrollTo({
      top: currSection.offsetTop,
      behavior: "smooth",
    });

    nav_bot_items.forEach((item) => item.classList.remove("active"));
    clickedItems.classList.add("active");

    let isNavChecked = hamburger_nav.checked;
    if (isNavChecked) {
      hamburger_nav.checked = false;
      nav_bot.classList.remove("active");
    }

    return;
  }
}

function handleWorksFilter(e) {
  const el = e.target;
  const currentFilter = el.closest(".filter__select");

  // toggle the filter
  if (el.closest(".filter__selected")) {
    const nextSibling = currentFilter.nextElementSibling;
    const prevSibling = currentFilter.previousElementSibling;

    let isCurrentFilterActive = currentFilter.classList.contains("active");
    if (!isCurrentFilterActive) {
      currentFilter.classList.add("active");
    } else {
      currentFilter.classList.remove("active");
    }

    let isNextSiblingActive =
      nextSibling && nextSibling.classList.contains("active");
    if (isNextSiblingActive) {
      nextSibling.classList.remove("active");

      return;
    }

    let isPrevSiblingActive =
      prevSibling && prevSibling.classList.contains("active");
    if (isPrevSiblingActive) {
      prevSibling.classList.remove("active");

      return;
    }

    return;
  }

  if (el.closest(".filter__items")) {
    const currentSelected = currentFilter.querySelector(".filter__selected");
    const currentOptions = currentFilter.querySelectorAll(".filter__items");
    const currentOption = el.closest(".filter__items");

    currentSelected.innerHTML = `
                                ${currentOption.textContent} 
                                <i class="fa-solid fa-chevron-down"></i>
                                <i class="fa-solid fa-xmark"></i>`;

    currentOptions.forEach((option) => option.classList.remove("active"));
    currentOption.classList.add("active");
    currentFilter.classList.remove("active");

    return;
  }
}

function handleToggleWorksSearch(e) {
  const el = e.target;

  if (el.closest(".fa-magnifying-glass")) {
    const activeFilters = works_filter.querySelectorAll(".filter__select");

    let isWorksSearchActive = works_search.classList.contains("active");
    if (isWorksSearchActive) {
      return;
    }

    activeFilters.forEach((filter) => filter.classList.remove("active"));
    works_filter.style.display = "none";
    works_search.classList.add("active");

    return;
  }

  if (el.closest(".fa-xmark")) {
    works_search.classList.remove("active");
    works_filter.style.display = "flex";

    return;
  }
}

function readFilesData(files) {
  createPopularCard(files);
  createWorksCard(files);
}

function createPopularCard(datas) {
  const container = document.querySelector(".popular-section .container__flex");

  datas.sort((a, b) => b.view_count - a.view_count);

  const popularDatas = datas.slice(0, 7);

  popularDatas.forEach((popular) => {
    const {
      id,
      title,
      file_type,
      view_count,
      upload_date,
      modified_date,
      img_url,
    } = popular;

    const card__date = modified_date || upload_date;
    const card_tag = file_type === "pdf" ? "kti" : "poster";

    container.innerHTML += `
    <div class="card" data-id="${id}" data-type="${card_tag}">
      <div class="card__img">
        <img
          src="${img_url}"
        />
      </div>

      <div class="card__views">
        <i class="fa-solid fa-eye"></i> 
        ${handleFormatView(view_count)}
      </div>

      <div class="card__content">
        <p class="card__title">${title}</p>
        <div class="card__info">
          <span class="card__tag ${card_tag}">
            <p>${card_tag}</p>
          </span>

          <span class="dot"></span>

          <p class="card__date">${handleFormatDate(card__date, "ddmmmyyyy")}</p>
        </div>
        <button class="card__button">Lihat</button>
      </div>
    </div>
    `;
  });
}

function createWorksCard(datas) {
  const container = document.querySelector(".works-section .container__grid");

  datas.sort((a, b) => {
    const dateA = new Date(a.modified_date) || new Date(a.upload_date);
    const dateB = new Date(b.modified_date) || new Date(b.upload_date);

    return dateB - dateA;
  });

  datas.forEach((data) => {
    const { id, file_type, upload_date, modified_date, img_url } = data;

    const card_date = modified_date || upload_date;
    const card_tag = file_type === "pdf" ? "kti" : "poster";

    container.innerHTML += `
    <div class="card" data-id="${id}" data-type="${card_tag}">
      <div class="card__img">
        <img
          src="${img_url}"
        />
      </div>

      <span class="card__date">
        <p>${handleFormatDate(card_date, "ddmmm")}</p>
      </span>

      <span class="card__tag ${card_tag}">
        <p>${card_tag}</p>
      </span>
    </div>
    `;
  });
}

function handleFormatView(views) {
  if (views >= 1000) {
    return views / 1000 + " K";
  }

  if (views >= 1000000) {
    return views / 1000000 + " M";
  }

  if (views >= 1000000000) {
    return views / 1000000000 + " B";
  }

  return views.toString();
}

function handleFormatDate(dateStr, format) {
  const date = new Date(dateStr);

  let result = "";

  if (format === "ddmmm") {
    result = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    return result;
  }

  if (format === "ddmmmyyyy") {
    result = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return result;
  }
}

// end of functions
