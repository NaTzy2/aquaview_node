import { setUpDomEl } from "./dom.utils.js";
import { fetchFilesDatas } from "./script.api.js";
import { attachEventListeners } from "./event.handler.js";
import { displayPopularWorks, displayAllWorks } from "./ui.components.js";

document.addEventListener("DOMContentLoaded", async () => {
  const filesDatas = await fetchFilesDatas();

  setUpDomEl()

  attachEventListeners(filesDatas);

  displayPopularWorks(filesDatas);
  displayAllWorks(filesDatas)
});