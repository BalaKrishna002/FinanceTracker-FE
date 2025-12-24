/**
 * Maps backend AggregationResponseDTO list into chart-friendly data
 *
 * @param {Array} dtoList
 * @param {"year" | "month"} mode
 * @param {string} timezone
 */
export const mapAggregationData = (dtoList, mode, timezone) => {
  if (!Array.isArray(dtoList)) return { chartData: [], total: { credit: 0, debit: 0 } };

  let totalCredit = 0;
  let totalDebit = 0;

  const chartData = dtoList.map((dto) => {
    const date = new Date(dto.periodStart);

    const label =
      mode === "year"
        ? formatMonth(date, timezone)
        : formatDay(date, timezone);

    const credit = Number(dto.totalCredit || 0);
    const debit = Number(dto.totalDebit || 0);

    totalCredit += credit;
    totalDebit += debit;

    return {
      label,
      credit,
      debit,
    };
  });

  return {
    chartData,
    total: { credit: totalCredit, debit: totalDebit },
  };
};

/* ---------------- HELPERS ---------------- */

const formatMonth = (date, timezone) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short", // Jan, Feb
  }).format(date);
};

const formatDay = (date, timezone) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    day: "2-digit", // 01, 02
  }).format(date);
};
