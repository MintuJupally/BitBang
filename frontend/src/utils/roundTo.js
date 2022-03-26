const roundTo = (price, roundTo = 2) => {
  return (
    Math.round((price + Number.EPSILON) * Math.pow(10, roundTo)) /
    Math.pow(10, roundTo)
  );
};

export default roundTo;
