// ─── Calculation Utilities (§3) ───────────────────────────────────────────────

/**
 * Net Weight (g) = Gross Weight − ((DiamondWeightCt + OtherStoneWeightCt) / 5) − otherWeightG
 * otherWeightG: direct gram deduction (shanks, posts, etc.)
 */
export function calcNetWeight(grossWeightG, diamondWeightCt, otherStoneWeightCt, otherWeightG = 0) {
  const base = grossWeightG - ((diamondWeightCt + otherStoneWeightCt) / 5);
  return Math.max(0, base - (parseFloat(otherWeightG) || 0));
}

/**
 * Diamond Weight (ct) = Σ caratTotal of all diamond rows
 */
export function calcTotalDiamondWeight(diamonds) {
  return diamonds.reduce((sum, d) => sum + (parseFloat(d.caratTotal) || 0), 0);
}

/**
 * Amount for each diamond row = caratTotal × ctPrice
 */
export function calcDiamondRowAmount(carat, ctPrice) {
  return (parseFloat(carat) || 0) * (parseFloat(ctPrice) || 0);
}

/**
 * Total Diamond Amount = Σ row amounts
 */
export function calcTotalDiamondAmount(diamonds) {
  return diamonds.reduce((sum, d) => sum + calcDiamondRowAmount(d.caratTotal, d.ctPrice), 0);
}

/**
 * Discount on Diamond = − Total Diamond Amount × discountPct/100
 * Returns a negative number.
 */
export function calcDiscountOnDiamond(totalDiamondAmount, discountPct) {
  return -(totalDiamondAmount * ((parseFloat(discountPct) || 0) / 100));
}

/**
 * Gold Amount = ratePerG × netWeightG
 */
export function calcGoldAmount(ratePerG, netWeightG) {
  return (parseFloat(ratePerG) || 0) * (parseFloat(netWeightG) || 0);
}

/**
 * Making Charge:
 *  if netWeightG is within [mcNetWtMin, mcNetWtMax] → mcFixedMinCharge (flat)
 *  else → goldAmount × makingChargePercent / 100
 */
export function calcMakingCharge(netWeightG, goldAmount, charges) {
  const { makingChargePercent, mcNetWtMin, mcNetWtMax, mcFixedMinCharge } = charges;
  const nw = parseFloat(netWeightG) || 0;
  const min = parseFloat(mcNetWtMin) ?? 0;
  const max = parseFloat(mcNetWtMax) ?? 0;
  if (nw >= min && nw <= max) {
    return parseFloat(mcFixedMinCharge) || 0;
  }
  return (parseFloat(goldAmount) || 0) * ((parseFloat(makingChargePercent) || 0) / 100);
}

/**
 * Returns the mode string for making charge
 */
export function getMakingChargeMode(netWeightG, charges) {
  const { mcNetWtMin, mcNetWtMax } = charges;
  const nw = parseFloat(netWeightG) || 0;
  const min = parseFloat(mcNetWtMin) ?? 0;
  const max = parseFloat(mcNetWtMax) ?? 0;
  return nw >= min && nw <= max ? 'fixed' : 'percent';
}

/**
 * Discount on Making Charge = − Making Charge × discountPct/100
 * Returns a negative number.
 */
export function calcDiscountOnMaking(makingCharge, discountPct) {
  return -(makingCharge * ((parseFloat(discountPct) || 0) / 100));
}

/**
 * Other Stone Amount = otherStoneWeightCt × ratePerCt
 */
export function calcOtherStoneAmount(otherStoneWeightCt, ratePerCt) {
  return (parseFloat(otherStoneWeightCt) || 0) * (parseFloat(ratePerCt) || 0);
}

/**
 * Full breakup calculation from item + settings
 */
export function calcBreakup(item, goldPricePerG, charges, diamondChart) {
  const diamonds = item.diamonds.map(d => ({
    ...d,
    amount: calcDiamondRowAmount(d.caratTotal, d.ctPrice),
  }));

  const totalDiamondWeightCt = calcTotalDiamondWeight(diamonds);
  const netWeightG = calcNetWeight(
    parseFloat(item.grossWeightG) || 0,
    totalDiamondWeightCt,
    parseFloat(item.otherStoneWeightCt) || 0,
    parseFloat(item.otherWeightG) || 0       // NEW: direct gram deduction
  );
  const totalDiamondAmount = calcTotalDiamondAmount(diamonds);

  // Only apply discount if user has enabled it
  const discountOnDiamond = item.diamondDiscountEnabled
    ? calcDiscountOnDiamond(totalDiamondAmount, item.diamondDiscountPct)
    : 0;

  const goldAmount = calcGoldAmount(goldPricePerG, netWeightG);
  const makingCharge = calcMakingCharge(netWeightG, goldAmount, charges);
  const makingChargeMode = getMakingChargeMode(netWeightG, charges);

  // Only apply discount if user has enabled it
  const discountOnMaking = item.makingDiscountEnabled
    ? calcDiscountOnMaking(makingCharge, item.makingDiscountPct)
    : 0;

  const otherStoneAmount = calcOtherStoneAmount(
    item.otherStoneWeightCt,
    charges.otherStoneRatePerCt
  );
  const certCharge = charges.includeCertification
    ? (parseFloat(charges.certificationCharge) || 0)
    : 0;

  const subtotal =
    totalDiamondAmount +
    discountOnDiamond +
    goldAmount +
    makingCharge +
    discountOnMaking +
    otherStoneAmount +
    certCharge;
  const vat = subtotal * 0.05;
  const grandTotal = subtotal + vat;

  return {
    diamonds,
    totalDiamondWeightCt,
    netWeightG,
    totalDiamondAmount,
    discountOnDiamond,
    discountOnMaking,
    goldAmount,
    makingCharge,
    makingChargeMode,
    otherStoneAmount,
    certCharge,
    subtotal,
    vat,
    grandTotal,
  };
}

/**
 * Format AED currency
 */
export function fmtAED(val) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return 'AED ' + Number(val).toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a number to 2 decimal places
 */
export function fmt2(val) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toFixed(2);
}

/**
 * Format date-time stamp
 */
export function fmtDatetime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-AE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
