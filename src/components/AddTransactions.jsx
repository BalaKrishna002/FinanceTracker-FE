import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import api from "../api/axios";

const emptyTxn = { amount: "", transactionType: "", description: "" };

const AddTransactions = ({ onSuccess }) => {
  const [transactions, setTransactions] = useState([{ ...emptyTxn }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (index, field, value) => {
    const copy = [...transactions];
    copy[index][field] = value;
    setTransactions(copy);
  };

  const addRow = () => setTransactions([...transactions, { ...emptyTxn }]);
  const removeRow = (index) =>
    setTransactions(transactions.filter((_, i) => i !== index));

  const submit = async () => {
    setError("");
    setSuccess("");

    try {
      await api.post("/api/transactions/bulk", transactions);
      setTransactions([{ ...emptyTxn }]);
      setSuccess("Transactions added successfully");
      if (onSuccess) onSuccess();
    } catch {
      setError("Failed to add transactions");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Transactions
      </Typography>

      {transactions.map((txn, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            p: 2,
            mb: 2,
            position: "relative",
          }}
        >
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={txn.amount}
              onChange={(e) => handleChange(index, "amount", e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="Transaction Type"
              value={txn.transactionType}
              onChange={(e) =>
                handleChange(index, "transactionType", e.target.value)
              }
            >
              <MenuItem value="DEBIT">DEBIT</MenuItem>
              <MenuItem value="CREDIT">CREDIT</MenuItem>
            </TextField>
          </Box>

          <TextField
            fullWidth
            label="Description"
            value={txn.description}
            onChange={(e) =>
              handleChange(index, "description", e.target.value)
            }
          />

          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => removeRow(index)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ))}

      <IconButton color="primary" onClick={addRow}>
        <AddCircleOutlineIcon fontSize="large" />
      </IconButton>

      <Box mt={2}>
        <Button variant="contained" onClick={submit}>
          Add Transactions
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" mt={1}>
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default AddTransactions;
