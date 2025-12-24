import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Button,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TransactionsList from "../components/TransactionsList";
import AddTransactionsModal from "../components/AddTransactionsModal";
import DashboardAnalytics from "../components/DashboardAnalytics";
import { getEpochRangeForDateInTimezone } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });
  const [transactions, setTransactions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const navigate = useNavigate();

  /* ------------------ API CALLS ------------------ */

  const fetchUserProfile = async () => {
    const res = await api.get(`/user/${userId}`);
    setUser(res.data);
  };

  const fetchTransactions = async (date) => {
    if (!user?.timezone) return;
    const { from, to } = getEpochRangeForDateInTimezone(date, user.timezone);
    const res = await api.get(`/transactions?from=${from}&to=${to}`);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchTransactions(selectedDate);
  }, [selectedDate, user?.timezone]);

  /* ------------------ UI ------------------ */
  console.log(user?.currency);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* ================= HEADER ================= */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #eee",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Date Picker */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <CalendarMonthIcon color="action" />
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Profile + Add */}
          <Box display="flex" alignItems="center" gap={2}>
            {user && (
              <Tooltip title="View Profile">
                <Button
                  onClick={() => navigate("/profile")}
                  sx={{
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    border: "1px solid #eee",
                    borderRadius: 3,
                    px: 2,
                    py: 0.6,
                    backgroundColor: "#fafafa",
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography fontSize="0.9rem" fontWeight={500}>
                    {user.fullName}
                  </Typography>
                </Button>
              </Tooltip>
            )}

            <Tooltip title="Add Transactions">
              <IconButton
                color="primary"
                onClick={() => setOpenAddModal(true)}
              >
                <AddCircleOutlineIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* ================= TRANSACTIONS ================= */}
      <Typography variant="h6" fontWeight={600} mb={1}>
        Transactions
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {selectedDate.toDateString()} ({user?.timezone || "UTC"})
      </Typography>


      <TransactionsList
        transactions={transactions}
        refresh={() => fetchTransactions(selectedDate)}
        userCurrency={user?.currency}
      />

      {/* ================= ANALYTICS ================= */}
      {user?.timezone && (
        <>
          <Divider sx={{ my: 5 }} />
          <DashboardAnalytics timezone={user.timezone} />
        </>
      )}

      {/* ================= ADD TRANSACTION MODAL ================= */}
      <AddTransactionsModal
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          fetchTransactions(selectedDate);
          setOpenAddModal(false);
        }}
      />
    </Container>
  );
};

export default Dashboard;
