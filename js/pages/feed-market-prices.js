import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {

    const container = document.getElementById("feedMarketPriceInputs");
    const saveBtn = document.getElementById("saveFeed");

 

  if (state.birds.broilers > 0) {
    container.innerHTML += `
      <h2>Broiler Feed Prices</h2>
      <label>
    Broiler Starter - Feed Bag Price
    <input id="broilerStarterBagPrice" type="number" min="0" step="0.01" />
  </label>

  <label>
    Broiler Finisher - Feed Bag Price
    <input id="broilerFinisherBagPrice" type="number" min="0" step="0.01" />
  </label>
    `;
  }

    if (state.birds.layers > 0) {
    container.innerHTML += `
      <h2>Layer Feed Prices</h2>
      <label>
    Layer Starter - Feed Bag Price
    <input id="layerStarterBagPrice" type="number" min="0" step="0.01" />
  </label>

  <label>
    Layer Grower - Feed Bag Price
    <input id="layerGrowerBagPrice" type="number" min="0" step="0.01" />
  </label>

  <label>
    Layer Mash - Feed Bag Price
    <input id="layerMashBagPrice" type="number" min="0" step="0.01" />
  </label>
    `;
  }

  // Store input values in state on save
  saveBtn.addEventListener("click", () => {
    state.feed.broilers.broilerStarter.bagPrice = Number(document.getElementById("broilerStarterBagPrice")?.value) || 0;
    state.feed.broilers.broilerFinisher.bagPrice = Number(document.getElementById("broilerFinisherBagPrice")?.value) || 0;
    state.feed.layers.layerStarter.bagPrice = Number(document.getElementById("layerStarterBagPrice")?.value) || 0;
    state.feed.layers.layerGrower.bagPrice = Number(document.getElementById("layerGrowerBagPrice")?.value) || 0;
    state.feed.layers.layerMash.bagPrice = Number(document.getElementById("layerMashBagPrice")?.value) || 0;
  });

  saveBtn.addEventListener("click", () => {
    navigate("feed");
  });

  // For debugging: log the entered prices
  console.log("Broiler Starter Bag Price:", state.feed.broilers.broilerStarter.bagPrice);
  console.log("Broiler Finisher Bag Price:", state.feed.broilers.broilerFinisher.bagPrice);
  console.log("Layer Starter Bag Price:", state.feed.layers.layerStarter.bagPrice);
  console.log("Layer Grower Bag Price:", state.feed.layers.layerGrower.bagPrice);
  console.log("Layer Mash Bag Price:", state.feed.layers.layerMash.bagPrice);
}