import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AnalyticsChart from "./AnalyticsChart";
import api from "../api/axios";
import {
  getEpochRangeForMonth,
  getEpochRangeForYear,
} from "../utils/dateUtils";
import { mapAggregationData } from "../utils/aggregationMapper";

const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DashboardAnalytics = ({ timezone }) => {
  const [mode, setMode] = useState("MONTH");
  const [chartType, setChartType] = useState("line");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState({ credit: 0, debit: 0 });

  const fetchAnalytics = async () => {
    if (!timezone) return;

    const range =
      mode === "YEAR"
        ? getEpochRangeForYear(timezone, year)
        : getEpochRangeForMonth(timezone, year, month);

    const res = await api.get(
      `/transactions/aggregation?mode=${mode}&from=${range.from}&to=${range.to}`
    );

    const mapped = mapAggregationData(res.data, mode.toLowerCase(), timezone);
    setChartData(mapped.chartData);
    setTotal(mapped.total);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [mode, year, month, timezone]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 3,
        border: "1px solid #eee",
        background: "linear-gradient(180deg, #fafafa, #ffffff)",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={600}>
          Analytics
        </Typography>

        <Box display="flex" gap={2}>
          {/* Mode Dropdown */}
          <Select
            size="small"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <MenuItem value="MONTH">Month</MenuItem>
            <MenuItem value="YEAR">Year</MenuItem>
          </Select>

          {/* Chart Toggle */}
          <ToggleButtonGroup
            value={chartType}
            exclusive
            size="small"
            onChange={(e, val) => val && setChartType(val)}
          >
            <ToggleButton value="line">Line</ToggleButton>
            <ToggleButton value="bar">Bar</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Pickers */}
      <Box display="flex" gap={2} mb={3}>
        {mode === "YEAR" && (
          <Select size="small" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        )}

        {mode === "MONTH" && (
          <>
            <Select size="small" value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m, i) => (
                <MenuItem key={m} value={i}>{m}</MenuItem>
              ))}
            </Select>

            <Select size="small" value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </>
        )}
      </Box>

      {/* Chart */}
      <AnalyticsChart
        title={
          mode === "YEAR"
            ? "Yearly Credit vs Debit"
            : "Monthly Credit vs Debit"
        }
        data={chartData}
        chartType={chartType}
      />

      {/* Totals */}
      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        sx={{
          backgroundColor: "#f9fafb",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={600} sx={{ color: "#2e7d32" }}>
          Total Credit: {total.credit}
        </Typography>
        <Typography fontWeight={600} sx={{ color: "#d32f2f" }}>
          Total Debit: {total.debit}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DashboardAnalytics;
