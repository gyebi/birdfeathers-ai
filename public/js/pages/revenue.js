import { state } from "../state.js";
import { navigate } from "../router.js";

const LAYER_PROFILE_CURVES = {
  conservative: [
    { months: 2, rate: 0.65 },
    { months: 6, rate: 0.85 },
    { months: 6, rate: 0.75 },
    { months: 4, rate: 0.55 }
  ],
  typical: [
    { months: 2, rate: 0.70 },
    { months: 6, rate: 0.90 },
    { months: 6, rate: 0.80 },
    { months: 4, rate: 0.65 }
  ],
  "high-performance": [
    { months: 2, rate: 0.75 },
    { months: 6, rate: 0.93 },
    { months: 6, rate: 0.85 },
    { months: 4, rate: 0.70 }
  ]
};

export function init() {
  const container = document.getElementById("revenueInputs");
  const saveBtn = document.getElementById("saveRevenue");
  const selectedLayProfile = state.production.layer.layProfile || "typical";
  const eggsPerLayerByProfile = Object.fromEntries(
    Object.entries(LAYER_PROFILE_CURVES).map(([profile, phases]) => {
      const totalEggs = phases.reduce(
        (sum, phase) => sum + (phase.months * 30 * phase.rate),
        0
      );
      return [profile, Math.round(totalEggs)];
    })
  );
  const renderField = (label, id, hint, extra = "") => `
    <label class="field-card">
      <span class="field-label">${label}</span>
      <span class="field-hint">${hint}</span>
      <input id="${id}" type="number" ${extra} />
    </label>
  `;
  const renderProfileOption = (value, title, description) => `
    <label class="profile-option profile-option--${value}">
      <input type="radio" name="layProfile" value="${value}" ${selectedLayProfile === value ? "checked" : ""} />
      <span class="profile-copy">
        <span class="profile-title">${title}</span>
        <span class="profile-description">${description}</span>
      </span>
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
        "Price per Egg",
        "eggPrice",
        "Enter the selling price for one egg.",
        'step="0.01" placeholder="0.00"'
      )}
      <div class="field-card">
        <span class="field-label">Layer Production Profile</span>
        <span class="field-hint">Choose the laying pattern</span>
        <div class="profile-group">
          ${renderProfileOption(
            "conservative",
            "Conservative",
            `${eggsPerLayerByProfile.conservative} eggs per surviving layer over 18 months, with faster decline over time.`
          )}
          ${renderProfileOption(
            "typical",
            "Typical",
            `${eggsPerLayerByProfile.typical} eggs per surviving layer over 18 months, with balanced commercial performance.`
          )}
          ${renderProfileOption(
            "high-performance",
            "High Performance",
            `${eggsPerLayerByProfile["high-performance"]} eggs per surviving layer over 18 months, with stronger peak production and slower decline.`
          )}
        </div>
      </div>
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

    state.production.layer.layProfile =
      document.querySelector('input[name="layProfile"]:checked')?.value || "typical";

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
