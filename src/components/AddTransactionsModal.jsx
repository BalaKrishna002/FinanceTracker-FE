import { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import api from "../api/axios";

const emptyTxn = { amount: "", transactionType: "", description: "" };

const AddTransactionsModal = ({ open, handleClose, onSuccess }) => {
  const [transactions, setTransactions] = useState([{ ...emptyTxn }]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (index, field, value) => {
    const copy = [...transactions];
    copy[index][field] = value;
    setTransactions(copy);
  };

  const addRow = () => setTransactions([...transactions, { ...emptyTxn }]);
  const removeRow = (index) =>
    setTransactions(transactions.filter((_, i) => i !== index));

  const submit = async () => {
    setMessage({ type: "", text: "" });
    try {
      await api.post("/api/transactions/bulk", transactions);
      setTransactions([{ ...emptyTxn }]);
      setMessage({ type: "success", text: "Transactions added successfully!" });
      if (onSuccess) onSuccess();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: "Failed to add transactions!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          p: 3,
          borderRadius: 2,
          width: { xs: "90%", sm: "600px" },
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Add Transactions
        </Typography>

        {/* Transactions Form */}
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
              onChange={(e) => handleChange(index, "description", e.target.value)}
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

        {/* Submit Button */}
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" onClick={submit}>
            Add Transactions
          </Button>
        </Box>

        {/* Message */}
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mt: 2 }}
          >
            {message.text}
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default AddTransactionsModal;
