import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  TextField,
  Alert,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const timezones = Intl.supportedValuesOf("timeZone");
const currencies = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CNY"];

const Profile = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchUser = async () => {
    const res = await api.get(`/user/${userId}`);
    setUser(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout(); // clear token & auth context
    navigate("/login");
  };

  const startEdit = (field) => {
    setEditField(field);
    setFieldValue(user[field]);
  };

  const cancelEdit = () => {
    setEditField("");
    setFieldValue("");
  };

  const saveField = async (field) => {
    try {
      await api.put(`/user/${userId}`, { [field]: fieldValue });
      setMessage({ type: "success", text: `${field} updated successfully!` });
      setEditField("");
      fetchUser();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: `Failed to update ${field}` });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  const renderField = (label, field, options) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
      p={2}
      sx={{
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0px 1px 5px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        {editField === field ? (
          <>
            {options ? (
              <TextField
                select
                size="small"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
              >
                {options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                size="small"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
              />
            )}
            <IconButton onClick={() => saveField(field)} color="success">
              <CheckIcon />
            </IconButton>
            <IconButton onClick={cancelEdit} color="error">
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="body1">{user[field]}</Typography>
            <IconButton onClick={() => startEdit(field)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* Logout Button */}
        <Tooltip title="Logout">
          <IconButton
            sx={{ position: "absolute", top: 16, right: 16 }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2" }}>
            {user.fullName?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Typography variant="h5" textAlign="center" mb={3}>
          User Profile
        </Typography>

        {/* Fields */}
        {renderField("Full Name", "fullName")}
        {renderField("Email", "email")}
        {renderField("Timezone", "timezone", timezones)}
        {renderField("Currency", "currency", currencies)}

        {message.text && (
          <Alert severity={message.type} sx={{ mt: 3 }}>
            {message.text}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
