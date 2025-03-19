import { DOM } from "./dom.utils.js";
import { handleWorksFilters } from "./filters.js";

export function attachEventListeners(datas) {
  const filesDatas = datas;

  window.addEventListener("scroll", handleToggleNavScrolled);
  DOM.hamburgerNav.addEventListener("change", handleToggleAsideNav);
  DOM.navBot.addEventListener("click", handleToggleNavLinks);

  DOM.worksFilter.addEventListener("click", (e) =>
    handleWorksFilters(e, filesDatas)
  );
  DOM.worksSearch.addEventListener("click", handleToggleWorksSearch);
}

export function handleToggleNavScrolled() {
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    DOM.nav.classList.add("active");
  } else {
    DOM.nav.classList.remove("active");
  }
}

export function handleToggleAsideNav() {
  DOM.navBot.classList.toggle("active", DOM.hamburgerNav.checked);
}

export function handleToggleNavLinks(e) {
  const el = e.target;
  const navHeight = DOM.nav.style.height;

  if (!el.closest(".nav__items")) return;

  const clickedItems = el.closest(".nav__items");
  const sections = {
    populer: ".popular-section",
    "karya kami": ".works-section",
  };

  const sectionClass = sections[clickedItems.textContent.toLowerCase()];

  if (!sectionClass) return;

  const currSection = document.querySelector(sectionClass);

  window.scrollTo({
    top: currSection.offsetTop - navHeight,
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
  const el = e.target;

  if (el.closest(".fa-xmark")) {
    DOM.worksSearch.classList.remove("active");
    DOM.worksFilter.style.display = "flex";

    return;
  }

  if(el.closest(".works__search") || el.closest(".fa-magnifying-glass"))
  {
    if(DOM.worksSearch.classList.contains('active')) return

    const activeFilters = DOM.worksFilter.querySelectorAll('.filter__select')
    activeFilters.forEach(filter => filter.classList.remove('active'))

    DOM.worksFilter.style.display = 'none'
    DOM.worksSearch.classList.add('active')

    return
  }
}
