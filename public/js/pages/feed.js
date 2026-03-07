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
  const bagInput = document.getElementById("bagPrice");

  const saveBtn = document.getElementById("saveFeed");
  const backBtn = document.getElementById("backFeed");

 
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
    <p>Broiler Starter Feed: ${broilerStarterKg.toFixed(2)} kg (${totalBagsStarter.toFixed(2)} bags)</p>
    <p>Broiler Finisher Feed: ${broilerFinisherKg.toFixed(2)} kg (${totalBagsFinisher.toFixed(2)} bags)</p>
    <p>Layer Starter Feed: ${layerStarterKg.toFixed(2)} kg (${totalBagsLayerStarter.toFixed(2)} bags)</p>
    <p>Layer Grower Feed: ${layerGrowerKg.toFixed(2)} kg (${totalBagsLayerGrower.toFixed(2)} bags)</p>
    <p>Layer Mash Feed: ${totalLayerMashKg.toFixed(2)} kg (${totalBagsLayerMash.toFixed(2)} bags)</p>
    <h2>Feed Summary</h2>
    <p>Total Feed Required: ${totalKg} kg</p>
    <p>Equivalent Bags (50kg): ${totalBags.toFixed(2)}</p>
    <p>Broiler Starter Cost per Bag: ${state.feed.broilers.broilerStarter.bagPrice.toFixed(2)} </p>
    <p>Broiler Finisher Cost per Bag: ${state.feed.broilers.broilerFinisher.bagPrice.toFixed(2)} </p>
    <p>Layer Starter Cost per Bag: ${state.feed.layers.layerStarter.bagPrice.toFixed(2)} </p>
    <p>Layer Grower Cost per Bag: ${state.feed.layers.layerGrower.bagPrice.toFixed(2)} </p>
    <p>Layer Mash Cost per Bag: ${state.feed.layers.layerMash.bagPrice.toFixed(2)} </p>
  `;
  } else if (broilers > 0) {
    summary.innerHTML = `
    <p>Broiler Starter Feed: ${broilerStarterKg.toFixed(2)} kg (${totalBagsStarter.toFixed(2)} bags)</p>
    <p>Broiler Finisher Feed: ${broilerFinisherKg.toFixed(2)} kg (${totalBagsFinisher.toFixed(2)} bags)</p>
    <h2>Feed Summary</h2>
    <p>Total Feed Required: ${totalKgB} kg</p>
    <p>Equivalent Bags (50kg): ${totalBagsB.toFixed(2)}</p>
    <p>Broiler Starter Cost per Bag: ${state.feed.broilers.broilerStarter.bagPrice.toFixed(2)} </p>
    <p>Broiler Finisher Cost per Bag: ${state.feed.broilers.broilerFinisher.bagPrice.toFixed(2)} </p>
  `;
  } else if (layers > 0) {
    summary.innerHTML = `
    <p>Layer Starter Feed: ${layerStarterKg.toFixed(2)} kg (${totalBagsLayerStarter.toFixed(2)} bags)</p>
    <p>Layer Grower Feed: ${layerGrowerKg.toFixed(2)} kg (${totalBagsLayerGrower.toFixed(2)} bags)</p>
    <p>Layer Mash Feed: ${totalLayerMashKg.toFixed(2)} kg (${totalBagsLayerMash.toFixed(2)} bags)</p>
    <h2>Feed Summary</h2>
    <p>Total Feed Required: ${totalKgL} kg</p>
    <p>Equivalent Bags (50kg): ${totalBagsL.toFixed(2)}</p>
    <p>Layer Starter Cost per Bag: ${state.feed.layers.layerStarter.bagPrice.toFixed(2)} </p>
    <p>Layer Grower Cost per Bag: ${state.feed.layers.layerGrower.bagPrice.toFixed(2)} </p>
    <p>Layer Mash Cost per Bag: ${state.feed.layers.layerMash.bagPrice.toFixed(2)} </p>
  `;
  } else {
    summary.innerHTML = `<p>No birds added. Please go back and enter bird details.</p>`;
  }

  saveBtn.addEventListener("click", () => {
  
    navigate("revenue");

  });

    backBtn.addEventListener("click", () => {
  
    navigate("feed-market-prices");

  });
}
