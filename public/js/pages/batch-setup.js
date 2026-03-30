import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const summary = document.getElementById("birdSummary");
  const priceContainer = document.getElementById("priceInputs");
  const saveBtn = document.getElementById("saveBatch");
  const renderPriceField = (label, id, hint) => `
    <label class="field-card">
      <span class="field-label">${label}</span>
      <span class="field-hint">${hint}</span>
      <input id="${id}" type="number" min="0" step="0.01" placeholder="0.00" />
    </label>
  `;

  console.log("Batch screen loaded");
  console.log(document.getElementById("birdSummary"));


    // Display selected birds
    if(summary){
  summary.textContent = `
    Flock summary: ${state.birds.broilers} broilers and ${state.birds.layers} layers
  `;
    }


    // Build pricing inputs dynamically
  if (state.flow.birdType === "broiler") {
    priceContainer.innerHTML = renderPriceField(
      "Broiler Price per Chick",
      "broilerPrice",
      "Enter the purchase cost for one broiler chick."
    );
  }

  if (state.flow.birdType === "layer") {
    priceContainer.innerHTML = renderPriceField(
      "Layer Price per Chick",
      "layerPrice",
      "Enter the purchase cost for one layer chick."
    );
  }

  if (state.flow.birdType === "both") {
    priceContainer.innerHTML = `
      ${renderPriceField(
        "Broiler Price per Chick",
        "broilerPrice",
        "Enter the purchase cost for one broiler chick."
      )}
      ${renderPriceField(
        "Layer Price per Chick",
        "layerPrice",
        "Enter the purchase cost for one layer chick."
      )}
    `;
  }

saveBtn.addEventListener("click", () => {
    state.batch.broilerCost =
      Number(document.getElementById("broilerPrice")?.value) || 0;

    state.batch.layerCost =
      Number(document.getElementById("layerPrice")?.value) || 0;

    navigate("feed-market-prices");
  });
}
