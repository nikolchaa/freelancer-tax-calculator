// Kvartalni parametri za 2026. godinu (frilenseri.purs.gov.rs)
export const TAX_YEAR = 2026;

export const MODEL_A = {
  normiraniTroskovi: 110647,
  taxRate: 0.2,
};

export const MODEL_B = {
  normiraniTroskovi: 66733,
  normiraniProcenat: 0.34,
  taxRate: 0.1,
  minPio: 36934, // 24% od 3 x 51.297 RSD (najniža mesečna osnovica)
};

export const PIO_RATE = 0.24;
export const HEALTH_RATE = 0.103;
export const MIN_HEALTH = 7003; // 10,3% od 3 x 22.663 RSD

const summarize = (incomeRsd, taxBase, tax, pio, health) => {
  const total = tax + pio + health;
  return {
    netRsd: incomeRsd - total,
    taxBase,
    tax,
    pio,
    health,
    total,
    totalPercent: incomeRsd > 0 ? (total / incomeRsd) * 100 : 0,
  };
};

const healthFor = (incomeRsd, base, insuredElsewhere) =>
  incomeRsd > 0 && !insuredElsewhere
    ? Math.max(base * HEALTH_RATE, MIN_HEALTH)
    : 0;

export const modelA = (incomeRsd, insuredElsewhere) => {
  const base = Math.max(incomeRsd - MODEL_A.normiraniTroskovi, 0);
  const tax = base * MODEL_A.taxRate;
  const pio = base * PIO_RATE;
  const health = healthFor(incomeRsd, base, insuredElsewhere);
  return summarize(incomeRsd, base, tax, pio, health);
};

export const modelB = (incomeRsd, insuredElsewhere) => {
  const expenses =
    MODEL_B.normiraniTroskovi + incomeRsd * MODEL_B.normiraniProcenat;
  const base = Math.max(incomeRsd - expenses, 0);
  const tax = base * MODEL_B.taxRate;
  const pio = incomeRsd > 0 ? Math.max(base * PIO_RATE, MODEL_B.minPio) : 0;
  const health = healthFor(incomeRsd, base, insuredElsewhere);
  return summarize(incomeRsd, base, tax, pio, health);
};
