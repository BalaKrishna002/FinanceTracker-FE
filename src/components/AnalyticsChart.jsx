import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";

// Props:
// title: string
// data: [{ label: string, credit: number, debit: number }]
const AnalyticsChart = ({ title, data }) => {
  if (!data || data.length === 0)
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontFamily: "Inter, Roboto, sans-serif" }}
      >
        No data available
      </Typography>
    );

  const chartFont = {
    fontFamily: "Inter, Roboto, sans-serif",
    fontSize: 14,
    fill: "#333",
    fontWeight: 500,
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
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            tick={chartFont}
            axisLine={{ stroke: "#ddd" }}
            tickLine={false}
          />
          <YAxis tick={chartFont} axisLine={{ stroke: "#ddd" }} tickLine={false} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              fontFamily: "Inter, Roboto, sans-serif",
              fontSize: 14,
            }}
            itemStyle={{ color: "#333", fontWeight: 500 }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontFamily: "Inter, Roboto, sans-serif",
              fontSize: 14,
              color: "#555",
              paddingTop: "10px",
            }}
          />

          <Line
            type="monotone"
            dataKey="credit"
            name="Credit"
            stroke="#2e7d32"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="debit"
            name="Debit"
            stroke="#d32f2f"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AnalyticsChart;
