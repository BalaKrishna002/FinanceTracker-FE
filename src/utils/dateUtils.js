/**
 * Internal helper
 * Converts a local Date into epoch milliseconds based on user timezone
 */
const toEpochInTimezone = (date, timezone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(date)
    .reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return Date.parse(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`
  );
};

/**
 * DAILY
 * Returns epoch range (from, to) for a specific date in user's timezone
 */
export const getEpochRangeForDateInTimezone = (date, timezone) => {
  if (!(date instanceof Date)) throw new Error("date must be a Date object");
  if (!timezone) throw new Error("timezone must be provided");

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const from = toEpochInTimezone(
    new Date(year, month, day, 0, 0, 0),
    timezone
  );

  const to = toEpochInTimezone(
    new Date(year, month, day, 23, 59, 59),
    timezone
  );

  return { from, to };
};

/**
 * MONTH ANALYTICS
 * Returns epoch range for a specific month & year in user's timezone
 */
export const getEpochRangeForMonth = (timezone, year, month) => {
  if (!timezone) throw new Error("timezone must be provided");

  const from = toEpochInTimezone(
    new Date(year, month, 1, 0, 0, 0),
    timezone
  );

  const to = toEpochInTimezone(
    new Date(year, month + 1, 0, 23, 59, 59),
    timezone
  );

  return { from, to };
};

/**
 * YEAR ANALYTICS
 * Returns epoch range for a specific year in user's timezone
 */
export const getEpochRangeForYear = (timezone, year) => {
  if (!timezone) throw new Error("timezone must be provided");

  const from = toEpochInTimezone(
    new Date(year, 0, 1, 0, 0, 0),
    timezone
  );

  const to = toEpochInTimezone(
    new Date(year, 11, 31, 23, 59, 59),
    timezone
  );

  return { from, to };
};
