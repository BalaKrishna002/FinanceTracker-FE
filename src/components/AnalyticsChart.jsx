import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";

const AnalyticsChart = ({ title, data, chartType }) => {
  if (!data || data.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontFamily: "Inter, Roboto, sans-serif" }}
      >
        No data available
      </Typography>
    );
  }

  const chartFont = {
    fontFamily: "Inter, Roboto, sans-serif",
    fontSize: 14,
    fill: "#333",
    fontWeight: 500,
  };

  const commonProps = {
    data,
    margin: { top: 10, right: 20, left: 0, bottom: 0 },
  };

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{ fontFamily: "Inter, Roboto, sans-serif", fontSize: 18 }}
      >
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === "bar" ? (
          <BarChart {...commonProps}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={chartFont} tickLine={false} />
            <YAxis tick={chartFont} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="credit" name="Credit" fill="#2e7d32" radius={[6, 6, 0, 0]} />
            <Bar dataKey="debit" name="Debit" fill="#d32f2f" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart {...commonProps}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={chartFont} tickLine={false} />
            <YAxis tick={chartFont} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="credit"
              name="Credit"
              stroke="#2e7d32"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="debit"
              name="Debit"
              stroke="#d32f2f"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default AnalyticsChart;
