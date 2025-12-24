import { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  return (
    <Box maxWidth={350} mx="auto" mt={8}>
      <Typography variant="h5">Login</Typography>

      <TextField fullWidth required label="Email" sx={{ mt: 2 }} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth required label="Password" type="password" sx={{ mt: 2 }} onChange={(e) => setPassword(e.target.value)} />

      {/* Link to Register page */}
      <Typography mt={2} variant="body2" textAlign="center">
        New to ftrack?{" "}
        <Link component="button" variant="body2" onClick={() => navigate("/register")} sx={{ fontWeight: 500 }}>
          Register here
        </Link>
      </Typography>

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
