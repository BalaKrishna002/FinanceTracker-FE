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
import { getTimezones } from "../utils/timezones";
import { currencies } from "../utils/currencies";

const Profile = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const timezones = getTimezones();

  useEffect(() => {
    api.get(`/user/${userId}`).then((res) => setUser(res.data));
  }, [userId]);

  const handleLogout = () => {
    logout();
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
      setEditField("");
      const res = await api.get(`/user/${userId}`);
      setUser(res.data);
      setMessage({ type: "success", text: "Updated successfully" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: "Update failed" });
    }
  };

  if (!user) return null;

  const Field = ({ label, field, options }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #eee",
        borderRadius: 2,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontWeight: 600 }}
      >
        {label}
      </Typography>

      <Box
        mt={0.5}
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ maxWidth: "100%" }}
      >
        {editField === field ? (
          <>
            {options ? (
              <TextField
                select
                size="small"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                fullWidth
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
                fullWidth
              />
            )}

            <IconButton size="small" color="success" onClick={() => saveField(field)}>
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={cancelEdit}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <Typography
              fontWeight={500}
              sx={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user[field]}
            </Typography>
            <IconButton size="small" onClick={() => startEdit(field)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #eee", position: "relative" }}>
        {/* Logout */}
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
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: "#111",
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            {user.fullName?.charAt(0)}
          </Avatar>
        </Box>

        <Typography textAlign="center" variant="h5" fontWeight={600} mb={4}>
          Profile
        </Typography>

        {/* 2x2 GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Field label="Full Name" field="fullName" />
          <Field label="Email" field="email" />
          <Field label="Timezone" field="timezone" options={timezones} />
          <Field
            label="Currency"
            field="currency"
            options={currencies.map((c) => c.code)}
          />
        </Box>

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
