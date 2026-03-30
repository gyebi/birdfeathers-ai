import { state } from "../state.js";
import { navigate } from "../router.js";

const feedRules = {
    broiler: {
        //sixWeeks:5,
        //eightWeeks:7
        6: { starter: 1.0, finisher: 4.0 },
        8: { starter: 1.0, finisher: 6.0 },
    },

    layer: {
        24: { starter: 1.5, grower: 4.0},
    }

};

export function init() {
  const summary = document.getElementById("feedSummary");

  const saveBtn = document.getElementById("saveFeed");
  const backBtn = document.getElementById("backFeed");
  const formatMeasure = (value, unit) => unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2);
  const renderMetric = (label, value) => `
    <div class="summary-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
  const renderSection = (title, rows) => `
    <section class="cost-card">
      <h2>${title}</h2>
      ${rows.join("")}
    </section>
  `;

 
  const broilers = state.birds.broilers || 0;
  const layers = state.birds.layers || 0;

  // Basic broiler feed formula (5kg per bird)
  const broilerStarterKg = broilers * feedRules.broiler[state.production.broilerWeeks].starter || 0;
  const broilerFinisherKg = broilers * feedRules.broiler[state.production.broilerWeeks].finisher || 0;
  

  //state.production.broilerWeeks === 6 ? feedRules.broiler[6] : feedRules.broiler[8];


  console.log("Broiler Starter Kg:", broilerStarterKg);
  console.log("Broiler Finisher Kg:", broilerFinisherKg);

  const totalKgB = broilerStarterKg + broilerFinisherKg;

  const totalBagsStarter = broilerStarterKg / state.feed.bagWeight;
  const totalBagsFinisher = broilerFinisherKg / state.feed.bagWeight;

  // Store Starter
  state.feed.broilers.broilerStarter.totalKg = broilerStarterKg;
  state.feed.broilers.broilerStarter.totalBags = totalBagsStarter;

  // Store Finisher
  state.feed.broilers.broilerFinisher.totalKg = broilerFinisherKg;
  state.feed.broilers.broilerFinisher.totalBags = totalBagsFinisher;

  console.log("Total Bags Starter:", totalBagsStarter);
  console.log("Total Bags Finisher:", totalBagsFinisher);
  
  const totalBagsB = totalBagsStarter + totalBagsFinisher;

  console.log("Total Bags Broilers:", totalBagsB);


  // Basic Layer feed formula ( per bird until they start laying, then 4kg per bird per month)
  
  const layerStarterKg = layers * feedRules.layer[state.production.layerWeeks].starter || 0;
  const layerGrowerKg = layers * feedRules.layer[state.production.layerWeeks].grower || 0;
  

  const totalBagsLayerStarter = layerStarterKg / state.feed.bagWeight;
  const totalBagsLayerGrower = layerGrowerKg / state.feed.bagWeight;


    // Store Layer Starter
  state.feed.layers.layerStarter.totalKg = layerStarterKg;
  state.feed.layers.layerStarter.totalBags = totalBagsLayerStarter;
  console.log("Total feed by Layer Starter Kg:", layerStarterKg);
  console.log("how many bags for layer starter:", totalBagsLayerStarter);


  // Store Layer Grower
  state.feed.layers.layerGrower.totalKg = layerGrowerKg;
  state.feed.layers.layerGrower.totalBags = totalBagsLayerGrower;
  console.log("Total feed by Layer Grower Kg:", layerGrowerKg);
  console.log("how many bags for layer grower:", totalBagsLayerGrower);

  console.log("layer Starter Kg:", layerStarterKg);
  console.log("layer Grower Kg:", layerGrowerKg);

  //Layer Marsh Feed Calculations 
  const survivingLayers =
  layers * (1 - (state.mortality.layerRate || 0) / 100);

  const dailyMashPerLayer =
  state.production.layer.dailyMarshFeedPerLayer || 0;

  const cycleDays =
  state.production.layer.cycleDays || 0;

  const totalLayerMashKg =
  survivingLayers * dailyMashPerLayer * cycleDays;

  state.feed.layers.layerMash.totalKg = totalLayerMashKg;
  console.log ("Total Marsh consumed as Layer Mash in a Cycle", totalLayerMashKg);

  const totalBagsLayerMash = totalLayerMashKg / state.feed.bagWeight;

  state.feed.layers.layerMash.totalBags = totalBagsLayerMash;
  console.log("how many bags for layer mash:", totalBagsLayerMash);
  

  const totalKgL = layerStarterKg + layerGrowerKg + totalLayerMashKg;
  const totalBagsL = totalBagsLayerStarter + totalBagsLayerGrower + totalBagsLayerMash;


  console.log("Total Kg Layers:", totalKgL);
  console.log("Total Bags Layers before start Laying:", totalBagsL);
  
  const totalKg = totalKgB + totalKgL;
  const totalBags = totalBagsB + totalBagsL;


  if (broilers > 0 && layers > 0) {
    summary.innerHTML = `
      ${renderSection("Broiler Feed Breakdown", [
        renderMetric("Starter Feed", `${formatMeasure(broilerStarterKg, "kg")} (${formatMeasure(totalBagsStarter, "bags")})`),
        renderMetric("Finisher Feed", `${formatMeasure(broilerFinisherKg, "kg")} (${formatMeasure(totalBagsFinisher, "bags")})`)
      ])}
      ${renderSection("Layer Feed Breakdown", [
        renderMetric("Starter Feed", `${formatMeasure(layerStarterKg, "kg")} (${formatMeasure(totalBagsLayerStarter, "bags")})`),
        renderMetric("Grower Feed", `${formatMeasure(layerGrowerKg, "kg")} (${formatMeasure(totalBagsLayerGrower, "bags")})`),
        renderMetric("Mash Feed", `${formatMeasure(totalLayerMashKg, "kg")} (${formatMeasure(totalBagsLayerMash, "bags")})`)
      ])}
      ${renderSection("Feed Summary", [
        renderMetric("Total Feed Required", formatMeasure(totalKg, "kg")),
        renderMetric("Equivalent Bags (50kg)", formatMeasure(totalBags, "bags")),
        renderMetric("Broiler Starter Price per Bag", formatMeasure(state.feed.broilers.broilerStarter.bagPrice, "")),
        renderMetric("Broiler Finisher Price per Bag", formatMeasure(state.feed.broilers.broilerFinisher.bagPrice, "")),
        renderMetric("Layer Starter Price per Bag", formatMeasure(state.feed.layers.layerStarter.bagPrice, "")),
        renderMetric("Layer Grower Price per Bag", formatMeasure(state.feed.layers.layerGrower.bagPrice, "")),
        renderMetric("Layer Mash Price per Bag", formatMeasure(state.feed.layers.layerMash.bagPrice, ""))
      ])}
    `;
  } else if (broilers > 0) {
    summary.innerHTML = `
      ${renderSection("Broiler Feed Breakdown", [
        renderMetric("Starter Feed", `${formatMeasure(broilerStarterKg, "kg")} (${formatMeasure(totalBagsStarter, "bags")})`),
        renderMetric("Finisher Feed", `${formatMeasure(broilerFinisherKg, "kg")} (${formatMeasure(totalBagsFinisher, "bags")})`)
      ])}
      ${renderSection("Feed Summary", [
        renderMetric("Total Feed Required", formatMeasure(totalKgB, "kg")),
        renderMetric("Equivalent Bags (50kg)", formatMeasure(totalBagsB, "bags")),
        renderMetric("Broiler Starter Price per Bag", formatMeasure(state.feed.broilers.broilerStarter.bagPrice, "")),
        renderMetric("Broiler Finisher Price per Bag", formatMeasure(state.feed.broilers.broilerFinisher.bagPrice, ""))
      ])}
    `;
  } else if (layers > 0) {
    summary.innerHTML = `
      ${renderSection("Layer Feed Breakdown", [
        renderMetric("Starter Feed", `${formatMeasure(layerStarterKg, "kg")} (${formatMeasure(totalBagsLayerStarter, "bags")})`),
        renderMetric("Grower Feed", `${formatMeasure(layerGrowerKg, "kg")} (${formatMeasure(totalBagsLayerGrower, "bags")})`),
        renderMetric("Mash Feed", `${formatMeasure(totalLayerMashKg, "kg")} (${formatMeasure(totalBagsLayerMash, "bags")})`)
      ])}
      ${renderSection("Feed Summary", [
        renderMetric("Total Feed Required", formatMeasure(totalKgL, "kg")),
        renderMetric("Equivalent Bags (50kg)", formatMeasure(totalBagsL, "bags")),
        renderMetric("Layer Starter Price per Bag", formatMeasure(state.feed.layers.layerStarter.bagPrice, "")),
        renderMetric("Layer Grower Price per Bag", formatMeasure(state.feed.layers.layerGrower.bagPrice, "")),
        renderMetric("Layer Mash Price per Bag", formatMeasure(state.feed.layers.layerMash.bagPrice, ""))
      ])}
    `;
  } else {
    summary.innerHTML = `
      <section class="cost-card">
        <p>No birds added. Please go back and enter bird details.</p>
      </section>
    `;
  }

  saveBtn.addEventListener("click", () => {
  
    navigate("revenue");

  });

    backBtn.addEventListener("click", () => {
  
    navigate("feed-market-prices");

  });
}
