import { navigate } from "./router.js";
import { state } from "./state.js";




// 1) Load the first screen
navigate("home");
console.log("Initial app state:", state);


// 2) After every navigation, attach the right button events
/*
window.addEventListener("route:changed", (e) => {
  const route = e.detail;

  if (route === "home") {
    document.getElementById("goBatch")?.addEventListener("click", () => {
      navigate("batch-setup");
    });
  }

  if (route === "batch-setup") {
    document.getElementById("goHome")?.addEventListener("click", () => {
      navigate("home");
    });
  }
});
*/

window.addEventListener("go:batch", () => navigate("batch-setup"));
window.addEventListener("go:home", () => navigate("home"));

