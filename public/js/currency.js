export function formatMoney(amount, locale, currency) {

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency
  }).format(amount || 0);

}