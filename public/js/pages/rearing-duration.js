import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const buttons = document.querySelectorAll("[data-weeks]");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const weeks = Number(btn.dataset.weeks);

      state.production.broilerWeeks = weeks;
      //state.production.layerWeeks = weeks;

      console.log("Broiler duration selected:", weeks);

      navigate("batch-setup");
    });
  });
}
