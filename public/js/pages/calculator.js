import { state } from "../state.js";
import { navigate } from "../router.js";
import { formatMoney } from "../currency.js";

export function init() {
  const chickCostEl = document.getElementById("chickCost");
  const feedCostEl = document.getElementById("feedCost");
  const totalCostEl = document.getElementById("totalCost");
  const eggRevenueEl = document.getElementById("eggRevenue");
  const broilerRevenueEl = document.getElementById("broilerRevenue");
  const resaleRevenueEl = document.getElementById("resaleRevenue");
  const totalLayerRevenueEl = document.getElementById("totalLayerRevenue");
  const totalRevenueEl = document.getElementById("totalRevenue");
  const profitEl = document.getElementById("profit");
  const backBtn = document.getElementById("backBatch");
  const saveBtn = document.getElementById("saveSummary");
  const aiInsightsBtn = document.getElementById("aiInsightsBtn");
  const aiInsightsBox = document.getElementById("aiInsightsBox");

  const format = value =>
    formatMoney(value, state.settings.locale, state.settings.currency);

  const broilerTotal =
    (state.birds.broilers || 0) * (state.batch.broilerCost || 0);
  const layerTotal =
    (state.birds.layers || 0) * (state.batch.layerCost || 0);
  const chickCost = broilerTotal + layerTotal;

  const survivingBroilers =
    state.birds.broilers *
    (1 - (state.mortality.broilerRate || 0) / 100);
  const survivingLayers =
    state.birds.layers *
    (1 - (state.mortality.layerRate || 0) / 100);

  const broilerStarterBags = state.feed.broilers.broilerStarter.totalBags;
  const broilerFinisherBags = state.feed.broilers.broilerFinisher.totalBags;
  const feedCostBroiler =
    broilerStarterBags * (state.feed.broilers.broilerStarter.bagPrice || 0);
  const feedCostFinisher =
    broilerFinisherBags * (state.feed.broilers.broilerFinisher.bagPrice || 0);
  const totalFeedCostBroilers = feedCostBroiler + feedCostFinisher;

  const layerStarterBags = state.feed.layers.layerStarter.totalBags;
  const layerGrowerBags = state.feed.layers.layerGrower.totalBags;
  const layerMashBags = state.feed.layers.layerMash.totalBags;
  const feedCostLayerStarter =
    layerStarterBags * (state.feed.layers.layerStarter.bagPrice || 0);
  const feedCostLayerGrower =
    layerGrowerBags * (state.feed.layers.layerGrower.bagPrice || 0);
  const costLayerMash =
    layerMashBags * (state.feed.layers.layerMash.bagPrice || 0);
  const totalFeedCostLayers =
    feedCostLayerStarter + feedCostLayerGrower + costLayerMash;

  const totalCost = chickCost + totalFeedCostBroilers + totalFeedCostLayers;

  chickCostEl.textContent = format(chickCost);
  feedCostEl.textContent = format(totalFeedCostBroilers + totalFeedCostLayers);
  totalCostEl.textContent = format(totalCost);

  let eggRevenue = 0;
  let resaleRevenue = 0;
  let totalLayerRevenue = 0;

  const broilerRevenue =
    survivingBroilers * (state.revenue.broilerSellPrice || 0);

  const rateOfLay = state.production.layer.rateOfLay || 0;
  const threshold = state.production.layer.cullThreshold;

  if (rateOfLay >= threshold) {
    const dailyEggs = survivingLayers * rateOfLay;
    const annualEggs =
      dailyEggs * (state.production.layer?.cycleDays || 365);
    const eggPrice =
      state.revenue.cratePrice ? state.revenue.cratePrice / 30 : 0;

    eggRevenue = annualEggs * eggPrice;
  } else {
    resaleRevenue =
      survivingLayers *
      (state.production.layer?.resalePricePerBird || 0);
  }

  totalLayerRevenue = eggRevenue + resaleRevenue;

  if (state.birds.layers > 0 && rateOfLay < threshold) {
    eggRevenueEl.style.color = "orange";
    console.warn("Layer productivity below threshold — consider culling.");
  }

  broilerRevenueEl.textContent = format(broilerRevenue);
  eggRevenueEl.textContent = format(eggRevenue);
  resaleRevenueEl.textContent = format(resaleRevenue);
  totalLayerRevenueEl.textContent = format(totalLayerRevenue);

  const totalRevenue = broilerRevenue + eggRevenue + resaleRevenue;
  totalRevenueEl.textContent = format(totalRevenue);

  const profit = totalRevenue - totalCost;

  if (profit > 0) {
    profitEl.textContent =
      `Congratulations! Going by your entries, you made a profit of ${format(profit)}`;
  } else if (profit < 0) {
    profitEl.textContent =
      `Unfortunately, based on your entries, you incurred a loss of ${format(profit)}`;
  } else {
    profitEl.textContent =
      "Your revenue and costs are perfectly balanced, resulting in a break-even scenario.";
  }

  profitEl.style.color = profit >= 0 ? "green" : "red";

  state.summary.costs.chickCost = chickCost;
  state.summary.costs.feedCostBroilers = totalFeedCostBroilers;
  state.summary.costs.feedCostLayers = totalFeedCostLayers;
  state.summary.costs.totalCost = totalCost;

  state.summary.revenue.broilerRevenue = broilerRevenue;
  state.summary.revenue.eggRevenue = eggRevenue;
  state.summary.revenue.resaleRevenue = resaleRevenue;
  state.summary.revenue.totalRevenue = totalRevenue;

  state.summary.profit.value = profit;

  state.summary.survival.survivingBroilers = survivingBroilers;
  state.summary.survival.survivingLayers = survivingLayers;

  backBtn.addEventListener("click", () => {
    navigate("bird-type");
  });

  saveBtn.addEventListener("click", () => {
    saveSummaryToLocal();
    alert("Summary saved to local storage!");
    navigate("bird-type");
  });

  if (aiInsightsBtn && aiInsightsBox) {
    aiInsightsBtn.addEventListener("click", async () => {
      const latest = getLatestCycle();

      if (!latest) {
        alert("No saved cycle found. Save a summary first.");
        return;
      }

      const functionUrl =
        "https://us-central1-birdfeathers-ai.cloudfunctions.net/aiInsights";

      aiInsightsBox.innerHTML = "Generating AI insights...";

      try {
        const res = await fetch(functionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cycle: latest })
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const data = await res.json();

        aiInsightsBox.innerHTML = `
          <h3>Summary</h3>
          <p>${data.summary}</p>

          <h3>Warnings</h3>
          <ul>${data.warnings.map(w => `<li>${w}</li>`).join("")}</ul>

          <h3>Recommendations</h3>
          <ul>${data.recommendations.map(r => `<li>${r}</li>`).join("")}</ul>
        `;
      } catch (err) {
        console.error(err);
        aiInsightsBox.innerHTML = "Failed to generate AI insights.";
      }
    });
  }
}

function getLatestCycle() {
  const cycles = JSON.parse(localStorage.getItem("bf_cycles")) || [];
  return cycles[cycles.length - 1] || null;
}

function saveSummaryToLocal() {
  const KEY = "bf_cycles";
  const existing = JSON.parse(localStorage.getItem(KEY)) || [];

  existing.push({
    savedAt: new Date().toISOString(),
    flow: state.flow,
    birds: state.birds,
    batch: state.batch,
    mortality: state.mortality,
    revenueInputs: state.revenue,
    summary: state.summary
  });

  localStorage.setItem(KEY, JSON.stringify(existing));
}
