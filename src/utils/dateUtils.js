/**
 * Returns epoch range (from, to) for a given date in a specific timezone.
 *
 * @param {Date} date - JS Date object
 * @param {string} timezone - IANA timezone string (e.g., "Asia/Kolkata")
 * @returns {{from: number, to: number}} - epoch milliseconds
 */
export const getEpochRangeForDateInTimezone = (date, timezone) => {
  if (!(date instanceof Date)) throw new Error("date must be a Date object");
  if (!timezone) throw new Error("timezone must be provided");

  // Use Intl.DateTimeFormat to get offset-adjusted parts
  const formatDateParts = (d, tz) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(d)
      .reduce((acc, part) => {
        if (part.type !== "literal") acc[part.type] = part.value;
        return acc;
      }, {});

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const day = date.getDate();

  // Start of day
  const startParts = formatDateParts(new Date(year, month, day, 0, 0, 0), timezone);
  const from = Date.parse(
    `${startParts.year}-${startParts.month}-${startParts.day}T${startParts.hour}:${startParts.minute}:${startParts.second}Z`
  );

  // End of day
  const endParts = formatDateParts(new Date(year, month, day, 23, 59, 59), timezone);
  const to = Date.parse(
    `${endParts.year}-${endParts.month}-${endParts.day}T${endParts.hour}:${endParts.minute}:${endParts.second}Z`
  );

  return { from, to };
};
