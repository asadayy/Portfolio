const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

export function formatMonthYear(isoDate: string): string {
  return MONTH_YEAR.format(new Date(isoDate));
}

/** "Jun 2025 — Sep 2025", or "Jun 2025 — Present" when endDate is null. */
export function formatDateRange(
  startIso: string,
  endIso: string | null
): string {
  return `${formatMonthYear(startIso)} — ${endIso ? formatMonthYear(endIso) : "Present"}`;
}
