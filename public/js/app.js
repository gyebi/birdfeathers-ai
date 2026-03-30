import { navigate } from "./router.js";
import { state } from "./state.js";
import { loadState, saveState } from "./storage.js";



// Root container
const app = document.getElementById("app");

function persistAppState() {
  saveState("birdfeathersState", state);
}

// Load saved state
const savedBirdType = loadState("birdType");
console.log("Saved bird type:", savedBirdType);

const savedState = loadState("birdfeathersState");

if(savedState){
  Object.assign (state, savedState);
} else if (savedBirdType) {
  state.flow.birdType = savedBirdType;
}

//start app
navigate("home");
console.log("Initial app state:", state);


// -------------------------------
// Bottom Navigation
// -------------------------------

const navButtons = document.querySelectorAll(".bottom-nav button");
function setActiveNav(screen) {
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === screen);
  });
}

navButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    const screen = btn.dataset.screen;

    navigate(screen);

  });

});

// -------------------------------
// Service Worker
// -------------------------------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {

    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.log("SW registration failed:", err));

  });
}



window.addEventListener("go:batch", () => navigate("batch-setup"));
window.addEventListener("go:home", () => navigate("home"));
window.addEventListener("route:changed", persistAppState);
window.addEventListener("route:changed", event => setActiveNav(event.detail));
window.addEventListener("beforeunload", persistAppState);
