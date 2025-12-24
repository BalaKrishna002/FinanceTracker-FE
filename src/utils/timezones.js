export const getTimezones = () =>
  Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : ["UTC"];
