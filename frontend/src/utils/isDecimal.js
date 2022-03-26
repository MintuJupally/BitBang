const isDecimal = (number) => {
  let dots = 0;
  for (var i = 0; i < number.length; i++) {
    if ((number[i] >= "0" && number[i] <= "9") || number[i] === ".") {
      if (number[i] === ".") ++dots;
      continue;
    }

    return false;
  }

  if (dots > 1) return false;
  if (number[0] === ".") return false;

  return true;
};

export default isDecimal;
