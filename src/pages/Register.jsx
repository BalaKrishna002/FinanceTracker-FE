import { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import api from "../api/axios";
import { getTimezones } from "../utils/timezones";
import { currencies } from "../utils/currencies";

const Register = () => {
  const [timezones, setTimezones] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", timezone: "", currency: ""
  });

  useEffect(() => setTimezones(getTimezones()), []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError("");
    try {
      await api.post("/auth/register", form);
      window.location.href = "/login";
    } catch {
      setError("Registration failed. Please check inputs.");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6}>
      <Typography variant="h5">Register</Typography>

      <TextField fullWidth label="Full Name" name="fullName" sx={{ mt: 2 }} onChange={handleChange} />
      <TextField fullWidth label="Email" name="email" sx={{ mt: 2 }} onChange={handleChange} />
      <TextField fullWidth label="Password" type="password" name="password" sx={{ mt: 2 }} onChange={handleChange} />

      <TextField select fullWidth label="Timezone" name="timezone" sx={{ mt: 2 }} onChange={handleChange}>
        {timezones.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
      </TextField>

      <TextField select fullWidth label="Currency" name="currency" sx={{ mt: 2 }} onChange={handleChange}>
        {currencies.map(c => <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>)}
      </TextField>

      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleRegister}>
        Register
      </Button>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Register;
