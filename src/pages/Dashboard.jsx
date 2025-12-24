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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TransactionsList from "../components/TransactionsList";
import AddTransactionsModal from "../components/AddTransactionsModal";
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

  // Fetch user profile
  const fetchUserProfile = async () => {
    const res = await api.get(`/user/${userId}`);
    setUser(res.data);
  };

  // Fetch transactions
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Left: Calendar */}
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarMonthIcon />
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "0.9rem",
            }}
          />
        </Box>

        {/* Right: Profile + Add */}
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Tooltip title="View Profile">
              <Button
                onClick={() => navigate("/profile")}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  backgroundColor: "#f9f9f9",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  {user.fullName}
                </Typography>
              </Button>
            </Tooltip>
          )}

          <IconButton color="primary" onClick={() => setOpenAddModal(true)}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Transactions for {selectedDate.toDateString()} ({user?.timezone || "UTC"})
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Transactions List */}
      <TransactionsList
        transactions={transactions}
        refresh={() => fetchTransactions(selectedDate)}
      />

      {/* Add Transactions Modal */}
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
