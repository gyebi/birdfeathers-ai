import { navigate } from "../router.js";

export function init() {
  const getStarted = document.querySelector(".primary-btn")
  getStarted?.addEventListener("click", () => {
    navigate("bird-type");
  });
}

