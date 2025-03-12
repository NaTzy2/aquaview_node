const hamburger_nav = document.getElementById("hamburger_nav");
const nav_bot = document.querySelector(".bot-nav");
const nav_bot_items = nav_bot.querySelectorAll(".nav__items");
const works_filter = document.querySelector(".works__filter");
const works_search = document.querySelector(".works__search");
const works_search_input = document.getElementById("works_search_input");

// event listeners
document.addEventListener("DOMContentLoaded", async () => {
  hamburger_nav.addEventListener("change", handleToggleAsideNav);
  nav_bot.addEventListener("click", handleToggleNavLinks);
  works_filter.addEventListener("click", handleWorksFilter);
  works_search.addEventListener("click", handleToggleWorksSearch);

  try {
    const response = await fetch("/api/files");

    if (!response.ok) throw new Error(`HTTP error! Stauts: ${response.status}`);

    const filesData = await response.json();

    readFilesData(filesData);
  } catch (error) {
    console.error("Error fetching files: ", error);
  }
});
// end of event listeners

// functions
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
    const navHeight = document.querySelector("nav").offsetHeight;

    window.scrollTo({
      top: currSection.offsetTop - navHeight,
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
  // handleCreateCards(files, "popular-section");
  // handleCreateCards(files, "works-section");
  const container = document.querySelector('.works-section .container__grid')

  files.forEach((file) => {
    const {
      id,
      title,
      file_type,
      upload_date,
      modified_date,
      view_count,
      img_url,
      pdf_url,
    } = file;

    const file_date = modified_date || upload_date
    const file_tag = file_type === 'pdf' ? 'kti' : 'poster'

    container.innerHTML += `
    <div class="card">
      <div class="card__img">
        <img
          src="${img_url}"
        />
      </div>

      <span class="card__date">
        <p>${handleFormatDate(file_date, 'ddmmm')}</p>
      </span>

      <span class="card__tag ${file_tag}">
        <p>${file_tag}</p>
      </span>
    </div>
    `
  });
}

// function handleCreateCards(files, sectionClass) {
//   const section = document.querySelector(sectionClass);

//   switch (sectionClass) {
//     case "works-section":
//       const container = section.querySelector(".container__flex");

//       files.forEach((file) => {
//         const {
//           id,
//           title,
//           file_type,
//           upload_date,
//           modified_date,
//           view_count,
//           img_url,
//           pdf_url,
//         } = file;
//       });
//       break;
//   }
// }

function handleFormatDate(dateStr, format)
{
  const date = new Date(dateStr)

  let result = ''

  if(format === 'ddmmm')
  {
    result = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    })

    return result
  }

  if(format === 'ddmmmyyyy')
  {
    result = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

    return result
  }
}

// end of functionsm
