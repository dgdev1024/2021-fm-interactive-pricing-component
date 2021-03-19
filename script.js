const pageViewCounter = document.querySelector(".pricing__page-view-count");
const billingPrice = document.querySelector(".pricing__price");
const billingPeriod = document.querySelector(".pricing__per");
const priceRange = document.querySelector(".pricing__price-range");
const billingToggle = document.querySelector(".pricing__billing-toggle");

const priceList = [
  { views: 10000, monthly: 8 },
  { views: 50000, monthly: 12 },
  { views: 100000, monthly: 16 },
  { views: 500000, monthly: 24 },
  { views: 1000000, monthly: 36 },
];

let showYearlyPrices = false;
let currentViews = 0;
let nextViews = 0;
let currentPrice = 0.0;
let nextPrice = 0.0;
let viewsInterval = null;
let priceInterval = null;

const stringifyPageViews = (views) => {
  if (views >= 1000000) {
    return `${Math.floor(views / 1000000)}M`;
  }

  return `${Math.floor(views / 1000)}K`;
};

const toYearlyPrice = (monthlyPrice) => 0.75 * (monthlyPrice * 12);

const updateViewCounter = () => {
  clearInterval(viewsInterval);

  if (currentViews !== nextViews) {
    const interpolation = (nextViews - currentViews) / 5;
    viewsInterval = setInterval(() => {
      currentViews += interpolation;
      pageViewCounter.innerHTML = stringifyPageViews(currentViews);

      if (currentViews === nextViews) {
        clearInterval(viewsInterval);
      }
    }, 50);
  }
};

const updateBillingPrice = () => {
  clearInterval(priceInterval);

  if (currentPrice !== nextPrice) {
    const interpolation = (nextPrice - currentPrice) / 5;
    priceInterval = setInterval(() => {
      currentPrice += interpolation;
      billingPrice.innerHTML = `$${currentPrice.toFixed(2)}`;

      if (Math.round(currentPrice) === nextPrice) {
        clearInterval(priceInterval);
      }
    }, 50);
  }

  billingPeriod.innerHTML = showYearlyPrices ? "/ year" : "/ month";
};

const getInitialBillingStatus = () => {
  const showYearly = localStorage.getItem("-fm-show-yearly");
  showYearlyPrices = showYearly !== null && showYearly == "true";
  billingToggle.dataset.yearly = showYearlyPrices;

  const priceListItem = priceList[priceRange.value];
  nextViews = priceListItem.views;
  nextPrice = showYearlyPrices
    ? toYearlyPrice(priceListItem.monthly)
    : priceListItem.monthly;
};

const onPriceRangeInput = () => {
  priceRange.style.setProperty("--progress-width", `${priceRange.value * 25}%`);

  const priceListItem = priceList[priceRange.value];
  nextViews = priceListItem.views;
  nextPrice = showYearlyPrices
    ? toYearlyPrice(priceListItem.monthly)
    : priceListItem.monthly;

  updateViewCounter();
  updateBillingPrice();
};

const onBillingToggleClick = () => {
  showYearlyPrices = !showYearlyPrices;
  billingToggle.dataset.yearly = showYearlyPrices;
  localStorage.setItem("-fm-show-yearly", showYearlyPrices.toString());

  const priceListItem = priceList[priceRange.value];
  nextPrice = showYearlyPrices
    ? toYearlyPrice(priceListItem.monthly)
    : priceListItem.monthly;

  updateBillingPrice();
};

window.addEventListener("DOMContentLoaded", () => {
  priceRange.style.setProperty("--progress-width", `${priceRange.value * 25}%`);
  getInitialBillingStatus();
  updateViewCounter();
  updateBillingPrice();
  priceRange.addEventListener("input", onPriceRangeInput);
  billingToggle.addEventListener("click", onBillingToggleClick);
});
