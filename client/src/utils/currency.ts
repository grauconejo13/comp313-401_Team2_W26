export function getCurrencySymbol(code: string) {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
    AUD: "$",
    CNY: "¥",
    INR: "₹"
  };

  return symbols[code] || code;
}