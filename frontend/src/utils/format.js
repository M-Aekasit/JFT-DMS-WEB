export function parsePlanningHours(value) {
  if (value === null || value === undefined || value === "") return 0;
  const numeric = Number(String(value).replace(/hr|h/gi, "").trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatPlanningHours(value) {
  const numeric = parsePlanningHours(value);
  const formatted = Number.isInteger(numeric)
    ? String(numeric)
    : numeric.toFixed(1).replace(/\.0$/, "");
  return `${formatted}H`;
}

export function percent(actual, plan) {
  return Math.min(100, Math.round((Number(actual || 0) / Math.max(Number(plan || 0), 1)) * 100));
}
