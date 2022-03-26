const showPrice = (price, roundTo = 2) => {
  let num =
    Math.round((price + Number.EPSILON) * Math.pow(10, roundTo)) /
    Math.pow(10, roundTo);

  const res = num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: roundTo,
    style: "currency",
    currency: "INR",
  });

  return res;
};

export default showPrice;
