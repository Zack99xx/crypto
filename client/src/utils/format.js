export const formatPrice = (price, currency) => {
  const formatter = new Intl.NumberFormat("eu-FR", {
    style: "currency",
    currency: currency,
  });
  return formatter.format(price);
};
