export const DOM = {
  nav: null,
  navBot: null,
  hamburgerNav: null,
  navBotItems: null,
  worksFilter: null,
  worksSearch: null,
  worksSearchInput: null,
  popularContainer: null,
  popularCardButton: null,
  worksGrid: null,
  worksPrev: null,
  worksNext: null,
  worksPageInput: null,
  modulePoster: null,
  moduleActionInfo: null,
  moduleActionDownload: null,
  moduleActionClose: null,
};

/**
 * Sets up DOM element references
 * @returns {boolean} True if all critical elements were found
 */
export function setUpDomEl() {
  DOM.nav = document.querySelector("nav");
  DOM.hamburgerNav = document.getElementById("hamburger_nav");
  DOM.navBot = document.querySelector(".bot-nav");
  DOM.navBotItems = DOM.navBot.querySelectorAll(".nav__items");
  DOM.worksFilter = document.querySelector(".works__filter");
  DOM.worksSearch = document.querySelector(".works__search");
  DOM.worksSearchInput = document.getElementById("works_search_input");
  DOM.popularContainer = document.querySelector(
    ".popular-section .container__flex"
  );
  DOM.worksGrid = document.querySelector(".works-section .container__grid");
  DOM.worksPrev = document.querySelector(".works__prev");
  DOM.worksNext = document.querySelector(".works__next");
  DOM.worksPageInput = document.querySelector(".works__pagination > input");
  DOM.modulePoster = document.querySelector(".module-poster");
  DOM.moduleActionInfo = DOM.modulePoster.querySelector(".action__info");
  DOM.moduleActionDownload = DOM.modulePoster.querySelector(".action__download");
  DOM.moduleActionClose = DOM.modulePoster.querySelector(".action__close");

  return true;
}
