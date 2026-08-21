export function formatPrice(
  amount: number,
  currency: string = "BDT",
  period?: "MONTHLY" | "YEARLY"
): string {
  if (amount === undefined || amount === null) return "৳0";

  const curr = (currency || "BDT").toUpperCase();
  const locale = curr === "BDT" ? "en-BD" : "en-US";

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);

    if (period) {
      const periodLabel = period === "MONTHLY" ? "/mo" : "/yr";
      return `${formatted}${periodLabel}`;
    }

    return formatted;
  } catch {
    return `${curr} ${amount.toLocaleString()}${period ? (period === "MONTHLY" ? "/mo" : "/yr") : ""}`;
  }
}

export function formatArea(
  value: number,
  unit: "sqft" | "sqm" | "katha" | "acre" | "decimal" | "bigha" = "sqft"
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
    case "decimal":
      return `${formattedNum} Decimal`;
    case "bigha":
      return `${formattedNum} Bigha`;
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
