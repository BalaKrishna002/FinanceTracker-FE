import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, 1);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <Box maxWidth={350} mx="auto" mt={8}>
      <Typography variant="h5">Login</Typography>

      <TextField fullWidth label="Email" sx={{ mt: 2 }} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" sx={{ mt: 2 }} onChange={(e) => setPassword(e.target.value)} />

      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>
        Login
      </Button>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Login;
