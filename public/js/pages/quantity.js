import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const container = document.getElementById("quantityInputs");
  const continueBtn = document.getElementById("continueQuantity");

  const renderField = (label, id, hint) => `
    <label class="field-card">
      <span class="field-label">${label}</span>
      <span class="field-hint">${hint}</span>
      <input id="${id}" type="number" min="0" placeholder="0" />
    </label>
  `;

  // Dynamically build inputs based on bird type
  if (state.flow.birdType === "broiler") {
    container.innerHTML = renderField(
      "Number of Broilers",
      "broilerCount",
      "Include every broiler bird in this production cycle."
    );
  }

  if (state.flow.birdType === "layer") {
    container.innerHTML = renderField(
      "Number of Layers",
      "layerCount",
      "Include every layer bird expected to enter this flock."
    );
  }

  if (state.flow.birdType === "both") {
    container.innerHTML = `
      ${renderField(
        "Number of Broilers",
        "broilerCount",
        "Include every broiler bird in this production cycle."
      )}
      ${renderField(
        "Number of Layers",
        "layerCount",
        "Include every layer bird expected to enter this flock."
      )}
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
