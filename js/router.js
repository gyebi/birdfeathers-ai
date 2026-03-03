
const routes = {
  
  home: "pages/home.html",
  "bird-type": "pages/bird-type.html",
  quantity: "pages/quantity.html",
  "rearing-duration": "pages/rearing-duration.html",
  "batch-setup": "pages/batch-setup.html",
  "feed-market-prices": "pages/feed-market-prices.html",
  feed:"pages/feed.html",
  revenue:"pages/revenue.html",
  calculator: "pages/calculator.html"
};



export async function navigate(route) {
  const app = document.getElementById("app");
  const file = routes[route];

  if (!file) {
    app.innerHTML = `<section style="padding:20px;"><h1>404</h1><p>Route not found: ${route}</p></section>`;
    return;
  }


  const res = await fetch(file);
  const html = await res.text();

  //app.classList.remove("show");
  //app.classList.add("fade");

  app.innerHTML = html;
 
  import(`./pages/${route}.js`).then(m => m.init());

  // Let app.js know a new screen loaded
  window.dispatchEvent(new CustomEvent("route:changed", { detail: route }));
}
