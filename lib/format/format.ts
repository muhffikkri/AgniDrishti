export function formatCurrency(value: number, currency = "INR", unit?: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const num = new Intl.NumberFormat(locale, {
    style: unit ? "decimal" : "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(value || 0));
  return unit ? `${num} ${unit}` : num;
}

export function formatNumber(v: number, decimals = 2) {
  if (!isFinite(v)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(v);
}

export function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export function formatDateTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatWeight(t: number) {
  return `${formatNumber(t, 2)} t`;
}

export function formatArea(v: number, u = "acres") {
  return `${formatNumber(v, 2)} ${u}`;
}
