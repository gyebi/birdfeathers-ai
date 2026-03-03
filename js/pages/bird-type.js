import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const buttons = document.querySelectorAll("[data-type]");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;

      state.flow.birdType = type;
      state.flow.step = 2;

      console.log("Bird type selected:", type);

      navigate("quantity");
    });
  });
}
