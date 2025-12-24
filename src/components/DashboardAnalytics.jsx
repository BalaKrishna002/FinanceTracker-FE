import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  MenuItem,
  Select,
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
  const [mode, setMode] = useState("month");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState({ credit: 0, debit: 0 });

  const fetchAnalytics = async () => {
    let range;

    if (mode === "year") {
      range = getEpochRangeForYear(timezone, year);
    } else {
      range = getEpochRangeForMonth(timezone, year, month);
    }

    const res = await api.get(
      `/transactions/aggregation?mode=${mode.toUpperCase()}&from=${range.from}&to=${range.to}`
    );

    const mapped = mapAggregationData(res.data, mode, timezone);
    setChartData(mapped.chartData);
    setTotal(mapped.total);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [mode, year, month]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #eee",
        background: "linear-gradient(180deg, #fafafa, #ffffff)",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Analytics Overview
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          size="small"
        >
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Pickers */}
      <Box display="flex" gap={2} mb={3}>
        {mode === "year" && (
          <Select size="small" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        )}

        {mode === "month" && (
          <>
            <Select
              size="small"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m, i) => (
                <MenuItem key={m} value={i}>{m}</MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </>
        )}
      </Box>

      {/* Chart */}
      <AnalyticsChart
        title={mode === "year" ? "Yearly Credit vs Debit" : "Monthly Credit vs Debit"}
        data={chartData}
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
