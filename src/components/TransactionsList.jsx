import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/axios";

const TransactionsList = ({ transactions, refresh }) => {
  const deleteTxn = async (id) => {
    await api.delete(`/transactions/${id}`);
    refresh();
  };

  const editTxn = (txn) => {
    // TODO: open modal to edit transaction
    console.log("Edit transaction", txn);
  };

  if (!transactions || transactions.length === 0) {
    return <Typography color="text.secondary">No transactions for this date</Typography>;
  }

  return (
    <>
      {transactions.map((txn) => (
        <Box
          key={txn.id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <Box>
            <Typography>
              {txn.transactionType === "DEBIT" ? "−" : "+"}₹{txn.amount} — {txn.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(txn.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>

          <Box>
            <IconButton size="small" onClick={() => editTxn(txn)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => deleteTxn(txn.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default TransactionsList;
