function roundMoney(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Number(n.toFixed(2));
}

function safeDivide(numerator, denominator, fallback = 0) {
  const num = Number(numerator);
  const den = Number(denominator);
  if (!den || Number.isNaN(den) || Number.isNaN(num)) return fallback;
  return num / den;
}

module.exports = { roundMoney, safeDivide };
