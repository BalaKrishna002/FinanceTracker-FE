import { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getTimezones } from "../utils/timezones";
import { currencies } from "../utils/currencies";

const Register = () => {
  const [timezones, setTimezones] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    timezone: "",
    currency: "",
  });

  const navigate = useNavigate();

  useEffect(() => setTimezones(getTimezones()), []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login"); // Redirect to login after successful registration
    } catch {
      setError("Registration failed. Please check inputs.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Register
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="fullName"
        sx={{ mt: 2 }}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        sx={{ mt: 2 }}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        sx={{ mt: 2 }}
        onChange={handleChange}
        required
      />

      <TextField
        select
        fullWidth
        required
        label="Timezone"
        name="timezone"
        sx={{ mt: 2 }}
        onChange={handleChange}
      >
        {timezones.map((tz) => (
          <MenuItem key={tz} value={tz}>
            {tz}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Currency"
        name="currency"
        sx={{ mt: 2 }}
        onChange={handleChange}
        required
      >
        {currencies.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            {c.code}
          </MenuItem>
        ))}
      </TextField>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleRegister}
      >
        Register
      </Button>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      {/* Link to login page */}
      <Typography mt={2} variant="body2" textAlign="center">
        Already registered?{" "}
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/login")}
          sx={{ fontWeight: 500 }}
        >
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
