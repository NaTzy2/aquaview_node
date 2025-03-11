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
});
// end of event listeners

// functions
function handleToggleAsideNav() {
  const navBot = nav_bot;

  if (hamburger_nav.checked) {
    navBot.classList.add("active");
  } else {
    navBot.classList.remove("active");
  }
}

function handleToggleNavLinks(e) {
  const el = e.target;

  if (el.closest(".nav__items")) {
    const clickedItems = el.closest(".nav__items");

    e.preventDefault();

    nav_bot_items.forEach((item) => item.classList.remove("active"));
    clickedItems.classList.add("active");

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
    let isWorksSearchActive = works_search.classList.contains("active");
    if (isWorksSearchActive) {
      return;
    }

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
// end of functionsm
