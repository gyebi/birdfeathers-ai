import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {

  const container = document.getElementById("feedMarketPriceInputs");
  const saveBtn = document.getElementById("saveFeed");
  const renderPriceField = (label, id, hint) => `
    <label class="field-card">
      <span class="field-label">${label}</span>
      <span class="field-hint">${hint}</span>
      <input id="${id}" type="number" min="0" step="0.01" placeholder="0.00" />
    </label>
  `;

 

  if (state.birds.broilers > 0) {
    container.innerHTML += `
      <div class="form-section">
        <h2>Broiler Feed Prices</h2>
        ${renderPriceField(
          "Broiler Starter Feed Bag Price",
          "broilerStarterBagPrice",
          "Enter the market price for one broiler starter feed bag."
        )}
        ${renderPriceField(
          "Broiler Finisher Feed Bag Price",
          "broilerFinisherBagPrice",
          "Enter the market price for one broiler finisher feed bag."
        )}
      </div>
    `;
  }

  if (state.birds.layers > 0) {
    container.innerHTML += `
      <div class="form-section">
        <h2>Layer Feed Prices</h2>
        ${renderPriceField(
          "Layer Starter Feed Bag Price",
          "layerStarterBagPrice",
          "Enter the market price for one layer starter feed bag."
        )}
        ${renderPriceField(
          "Layer Grower Feed Bag Price",
          "layerGrowerBagPrice",
          "Enter the market price for one layer grower feed bag."
        )}
        ${renderPriceField(
          "Layer Mash Feed Bag Price",
          "layerMashBagPrice",
          "Enter the market price for one layer mash feed bag."
        )}
      </div>
    `;
  }

  // Store input values in state on save
  saveBtn.addEventListener("click", () => {
    state.feed.broilers.broilerStarter.bagPrice = Number(document.getElementById("broilerStarterBagPrice")?.value) || 0;
    state.feed.broilers.broilerFinisher.bagPrice = Number(document.getElementById("broilerFinisherBagPrice")?.value) || 0;
    state.feed.layers.layerStarter.bagPrice = Number(document.getElementById("layerStarterBagPrice")?.value) || 0;
    state.feed.layers.layerGrower.bagPrice = Number(document.getElementById("layerGrowerBagPrice")?.value) || 0;
    state.feed.layers.layerMash.bagPrice = Number(document.getElementById("layerMashBagPrice")?.value) || 0;
    navigate("feed");
  });

  // For debugging: log the entered prices
  console.log("Broiler Starter Bag Price:", state.feed.broilers.broilerStarter.bagPrice);
  console.log("Broiler Finisher Bag Price:", state.feed.broilers.broilerFinisher.bagPrice);
  console.log("Layer Starter Bag Price:", state.feed.layers.layerStarter.bagPrice);
  console.log("Layer Grower Bag Price:", state.feed.layers.layerGrower.bagPrice);
  console.log("Layer Mash Bag Price:", state.feed.layers.layerMash.bagPrice);
}
