export function formatPrice(
  amount: number,
  currency: string = "USD",
  period?: "MONTHLY" | "YEARLY"
): string {
  if (amount === undefined || amount === null) return "$0";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase() === "BDT" ? "BDT" : currency.toUpperCase() === "EUR" ? "EUR" : currency.toUpperCase() === "GBP" ? "GBP" : "USD",
    maximumFractionDigits: 0,
  }).format(amount);

  if (period) {
    const periodLabel = period === "MONTHLY" ? "/mo" : "/yr";
    return `${formatted}${periodLabel}`;
  }

  return formatted;
}

export function formatArea(
  value: number,
  unit: "sqft" | "sqm" | "katha" | "acre" = "sqft"
): string {
  if (!value) return "0 sq ft";
  const formattedNum = new Intl.NumberFormat("en-US").format(value);
  switch (unit) {
    case "sqft":
      return `${formattedNum} sq ft`;
    case "sqm":
      return `${formattedNum} m²`;
    case "katha":
      return `${formattedNum} Katha`;
    case "acre":
      return `${formattedNum} Acres`;
    default:
      return `${formattedNum} ${unit}`;
  }
}

export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}
