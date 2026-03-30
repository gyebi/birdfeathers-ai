import { state } from "../state.js";
import { formatMoney } from "../currency.js";

export function init(){

  const s = state.summary;
  const settings = state.settings;
  const flockTotalBar = document.getElementById("flockTotalBar");
  const flockSurvivingBar = document.getElementById("flockSurvivingBar");
  const costBar = document.getElementById("costBar");
  const revenueBar = document.getElementById("revenueBar");
  const birdTypeLabels = {
    broiler: "Broiler",
    layer: "Layer",
    both: "Broiler and Layer"
  };

  const chickCost = s.costs.chickCost || 0;
  const feedCost =
    (s.costs.feedCostBroilers || 0) +
    (s.costs.feedCostLayers || 0);

  const totalCost = s.costs.totalCost || 0;
  const totalRevenue = s.revenue.totalRevenue || 0;
  const totalEggs = s.revenue.totalEggs || 0;
  const profit = s.profit.value || 0;

  const birds =
    (state.birds.broilers || 0) +
    (state.birds.layers || 0);

  const surviving =
    (s.survival.survivingBroilers || 0) +
    (s.survival.survivingLayers || 0);


  document.getElementById("rBirdType").textContent =
    birdTypeLabels[state.flow.birdType] || "Not selected";

  document.getElementById("rBirds").textContent = birds;

  document.getElementById("rSurviving").textContent =
    Math.round(surviving);


  document.getElementById("rChickCost").textContent =
    formatMoney(chickCost, settings.locale, settings.currency);

  document.getElementById("rFeedCost").textContent =
    formatMoney(feedCost, settings.locale, settings.currency);

  document.getElementById("rTotalCost").textContent =
    formatMoney(totalCost, settings.locale, settings.currency);

  document.getElementById("rRevenue").textContent =
    formatMoney(totalRevenue, settings.locale, settings.currency);

  document.getElementById("rEggs").textContent =
    Math.round(totalEggs).toLocaleString(settings.locale);

  document.getElementById("rProfit").textContent =
    formatMoney(profit, settings.locale, settings.currency);

  const flockMax = Math.max(birds, 1);
  const financialMax = Math.max(totalCost, totalRevenue, 1);

  flockTotalBar.style.width = `${(birds / flockMax) * 100}%`;
  flockSurvivingBar.style.width = `${(surviving / flockMax) * 100}%`;
  costBar.style.width = `${(totalCost / financialMax) * 100}%`;
  revenueBar.style.width = `${(totalRevenue / financialMax) * 100}%`;


  const story =
`For a flock of ${birds} birds, about ${Math.round(surviving)} birds are expected to survive after mortality.

Your estimated total cost is ${formatMoney(totalCost, settings.locale, settings.currency)}.

Projected revenue is ${formatMoney(totalRevenue, settings.locale, settings.currency)}.

This gives an estimated margin of ${formatMoney(profit, settings.locale, settings.currency)} before accounting for additional operational costs.`;

  document.getElementById("results-story").textContent = story;

}
