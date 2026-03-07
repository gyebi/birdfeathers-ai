import { navigate } from "../router.js";

export function init() {
  const pPlanning = document.getElementById("startPlanning")
  pPlanning.addEventListener("click", () => {
    navigate("bird-type");
  });
}
