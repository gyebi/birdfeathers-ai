import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const summary = document.getElementById("birdSummary");
  const priceContainer = document.getElementById("priceInputs");
  const saveBtn = document.getElementById("saveBatch");

  console.log("Batch screen loaded");
  console.log(document.getElementById("birdSummary"));


    // Display selected birds
    if(summary){
  summary.textContent = `
    Broilers: ${state.birds.broilers} 
    | Layers: ${state.birds.layers}
  `;
    }


    // Build pricing inputs dynamically
  if (state.flow.birdType === "broiler") {
    priceContainer.innerHTML = `
      <label>
        Broiler Price per Chick
        <input id="broilerPrice" type="number" min="0" step="0.01" />
      </label>
    `;
  }

  if (state.flow.birdType === "layer") {
    priceContainer.innerHTML = `
      <label>
        Layer Price per Chick
        <input id="layerPrice" type="number" min="0" step="0.01" />
      </label>
    `;
  }

  if (state.flow.birdType === "both") {
    priceContainer.innerHTML = `
      <label>
        Broiler Price per Chick
        <input id="broilerPrice" type="number" min="0" step="0.01" />
      </label>

      <label>
        Layer Price per Chick
        <input id="layerPrice" type="number" min="0" step="0.01" />
      </label>
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
