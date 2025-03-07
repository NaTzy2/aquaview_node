const hamburger_nav = document.getElementById("hamburger_nav");
const nav_bot = document.querySelector(".bot-nav");
const nav_bot_items = nav_bot.querySelectorAll(".nav__items");

// event listeners
document.addEventListener("DOMContentLoaded", async () => {
  nav_bot.addEventListener("click", handleToggleNavLinks);
  hamburger_nav.addEventListener("change", handleToggleAsideNav);
});
// end of event listeners

// functions
function handleToggleNavLinks(e) {
  const el = e.target;
  const navItems = nav_bot_items;

  if (el.closest(".nav__items")) {
    const clickedItems = el.closest(".nav__items");

    e.preventDefault();

    navItems.forEach((item) => item.classList.remove("active"));
    clickedItems.classList.add("active");

    return;
  }
}

function handleToggleAsideNav() {
  const hamburgerNav = hamburger_nav;
  const navBot = nav_bot;

  if (hamburgerNav.checked) {
    navBot.classList.add("active");
  } else {
    navBot.classList.remove("active");
  }
}
// end of functions
