import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const container = document.getElementById("quantityInputs");
  const continueBtn = document.getElementById("continueQuantity");

  // Dynamically build inputs based on bird type
  if (state.flow.birdType === "broiler") {
    container.innerHTML = `
      <label>
        Number of Broilers
        <input id="broilerCount" type="number" min="0" />
      </label>
    `;
  }

  if (state.flow.birdType === "layer") {
    container.innerHTML = `
      <label>
        Number of Layers
        <input id="layerCount" type="number" min="0" />
      </label>
    `;
  }

  if (state.flow.birdType === "both") {
    container.innerHTML = `
      <label>
        Number of Broilers
        <input id="broilerCount" type="number" min="0" />
      </label>

      <label>
        Number of Layers
        <input id="layerCount" type="number" min="0" />
      </label>
    `;
  }

  continueBtn.addEventListener("click", () => {
    state.birds.broilers =
      Number(document.getElementById("broilerCount")?.value) || 0;

    state.birds.layers =
      Number(document.getElementById("layerCount")?.value) || 0;

         if (

  state.flow.birdType === "broiler" ||
  state.flow.birdType === "both"
) {

  navigate("rearing-duration");
  
} else {
 navigate("batch-setup");
}

    console.log("Bird quantities saved:", state.birds);

 });

}
