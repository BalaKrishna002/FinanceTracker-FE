import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import api from "../api/axios";
import { currencies } from "../utils/currencies"; // import updated currencies

const TransactionsList = ({ transactions, refresh, userCurrency }) => {
  const deleteTxn = async (id) => {
    await api.delete(`/transactions/${id}`);
    refresh();
  };

  const editTxn = (txn) => {
    // TODO: open modal to edit transaction
    console.log("Edit transaction", txn);
  };

  const getCurrencyInfo = (code) => {
    return currencies.find((c) => c.code === code) || { symbol: code, prefix: true };
  };

  if (!transactions || transactions.length === 0) {
    return <Typography color="text.secondary">No transactions for this date</Typography>;
  }

  const currencyInfo = getCurrencyInfo(userCurrency);

  const formatAmount = (amount) =>
    currencyInfo.prefix ? `${currencyInfo.symbol}${amount}` : `${amount}${currencyInfo.symbol}`;

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
          <Box display="flex" alignItems="center" gap={1}>
            {txn.transactionType === "CREDIT" ? (
              <ArrowUpwardIcon sx={{ color: "green" }} fontSize="small" />
            ) : (
              <ArrowDownwardIcon sx={{ color: "red" }} fontSize="small" />
            )}
            <Box>
              <Typography sx={{ color: txn.transactionType === "CREDIT" ? "green" : "red" }}>
                {formatAmount(txn.amount)} — {txn.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(txn.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
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
