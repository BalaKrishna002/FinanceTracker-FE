import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TransactionCard = ({ txn, onEdit, onDelete }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            {txn.transactionType} - {txn.amount}
          </Typography>

          <Box>
            <IconButton onClick={() => onEdit(txn)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(txn.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography color="text.secondary">
          {txn.description}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {new Date(txn.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
