import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const container = document.getElementById("revenueInputs");
  const saveBtn = document.getElementById("saveRevenue");
  const renderField = (label, id, hint, extra = "") => `
    <label class="field-card">
      <span class="field-label">${label}</span>
      <span class="field-hint">${hint}</span>
      <input id="${id}" type="number" ${extra} />
    </label>
  `;


  //build broiler section
  if (state.birds.broilers > 0) {
    container.innerHTML += `
    <div class="form-section">
      <h2>Broiler Revenue Assumptions</h2>
      ${renderField(
        "Broiler Mortality (%)",
        "broilerMortality",
        "Enter the expected mortality rate for broilers in this cycle.",
        'min="0" max="100" placeholder="0"'
      )}
      ${renderField(
        "Selling Price per Bird",
        "broilerSellPrice",
        "Enter the expected selling price for one broiler bird.",
        'step="0.01" placeholder="0.00"'
      )}
    </div>
    `;
  }

  //Build layer section
  if (state.birds.layers > 0) {
    container.innerHTML += `
    <div class="form-section">
      <h2>Layer Revenue Assumptions</h2>
      ${renderField(
        "Mortality (%)",
        "layerMortality",
        "Enter the expected mortality rate for layers in this cycle.",
        'min="0" max="100" placeholder="0"'
      )}
      ${renderField(
        "Rate of Lay (%)",
        "rateOfLay",
        "Enter the expected laying rate as a percentage.",
        'min="0" max="100" placeholder="0"'
      )}
      ${renderField(
        "Price per Egg",
        "eggPrice",
        "Enter the selling price for one egg.",
        'step="0.01" placeholder="0.00"'
      )}
      ${renderField(
        "Price per Crate (30 eggs)",
        "cratePrice",
        "Enter the selling price for one full crate.",
        'step="0.01" placeholder="0.00"'
      )}
      ${renderField(
        "Spent Layer Resale Price (per bird)",
        "resalePrice",
        "Enter the resale value for one spent layer bird.",
        'step="0.01" placeholder="0.00"'
      )}
    </div>
    `;
  }

  saveBtn.addEventListener("click", () => {

    //Broiler Section 
    state.mortality.broilerRate =
      Number(document.getElementById("broilerMortality")?.value) || 0;

    state.revenue.broilerSellPrice =
      Number(document.getElementById("broilerSellPrice")?.value) || 0;

    //Layer Section 
    state.mortality.layerRate =
      Number(document.getElementById("layerMortality")?.value) || 0;

    state.production.layer.rateOfLay =
      (Number(document.getElementById("rateOfLay")?.value) || 0) / 100;

    state.revenue.eggPrice =
      Number(document.getElementById("eggPrice")?.value) || 0;

    state.revenue.cratePrice =
      Number(document.getElementById("cratePrice")?.value) || 0;

    state.production.layer.resalePricePerBird =
      Number(document.getElementById("resalePrice")?.value) || 0;

    console.log("Revenue data saved:", state);


    navigate("calculator");
  });
}
