import { state } from "../state.js";
import { navigate } from "../router.js";

export function init() {
  const container = document.getElementById("revenueInputs");
  const saveBtn = document.getElementById("saveRevenue");


  //build broiler section
  if (state.birds.broilers > 0) {
    container.innerHTML += `
    <h3>Broilers</h3>
      
       <label>
        Broiler Mortality (%) 
        <input id="broilerMortality" type="number" min="0" max="100" />
      </label>
        

       
        <label>
        Selling Price per Bird
        <input id="broilerSellPrice" type="number" step="0.01" />
      </label>
    `;
  }

  //Build layer section
  if (state.birds.layers > 0) {
    container.innerHTML += `

    <h3> Layers </h3>

    <label>
        Mortality (%)
        <input id="layerMortality" type="number" min="0" max="100" />
      </label>

      <label>
        Rate of Lay (%)
        <input id="rateOfLay" type="number" min="0" max="100" />
      </label>

      <label>
        Price per Egg
        <input id="eggPrice" type="number" step="0.01" />
      </label>

      <label>
        Price per Crate (30 eggs)
        <input id="cratePrice" type="number" step="0.01" />
      </label>

      <label>
        Spent Layer Resale Price (per bird)
        <input id="resalePrice" type="number" step="0.01" />
      </label>
    `;
  }

  saveBtn.addEventListener("click", () => {

    //Broiler Section 
    state.revenue.broilerPricePerBird =
      Number(document.getElementById("broilerPricePerBird")?.value) || 0;

      state.mortality.broilerRate =
      Number(document.getElementById("broilerMortality")?.value) || 0;

      state.revenue.broilerSellPrice =
      Number(document.getElementById("broilerSellPrice")?.value) || 0;

    //Layer Section 
    state.mortality.layerRate =
      Number(document.getElementById("layerMortality")?.value) || 0;

    state.production.layer.rateOfLay =
      (Number(document.getElementById("rateOfLay")?.value) || 0) / 100;

    state.revenue.layerEggPrice =
      Number(document.getElementById("eggPrice")?.value) || 0;

    state.revenue.cratePrice =
      Number(document.getElementById("cratePrice")?.value) || 0;

    state.production.layer.resalePricePerBird =
      Number(document.getElementById("resalePrice")?.value) || 0;

    console.log("Revenue data saved:", state);


    navigate("calculator");
  });
}
