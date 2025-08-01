// src/pages/AuthPage.jsx
import { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Alert,
  Stack
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import  useAuthStore  from "../store/useAuthStore"; 
import {useShallow} from "zustand/shallow"; 
import { useNavigate } from "react-router-dom";
import Logo from "../utils/Logo";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, signup, error  } = useAuthStore(useShallow((state) => ({
    login: state.login, signup: state.signup, error: state.error, loading: state.loading
  })));

  const toggleMode = () => setIsLogin(!isLogin);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Invalid email";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!isLogin && !form.userName.trim())
      errs.userName = "Username is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            email: form.email,
            password: form.password,
            userName: form.userName,
          };

      isLogin ? await login(payload) : await signup(payload);
      navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      sx={{
        //backgroundImage: `url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(2px)",
        backgroundRepeat: "no-repeat",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#ffffff" : "#ffffff", 
      }}
    >
      <Card
        sx={{
          maxWidth: { xs: '100%', sm: 550 }, // Full width on mobile
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          mx: { xs: 1, sm: 0 }, // Small margin on mobile
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}> {/* Less padding on mobile */}
          {/* Header with Logo and Name */}
          <Box display="flex" alignItems="center" mb={2}>
            <Logo />
          </Box>

          <Typography 
            variant="subtitle1" 
            color="textSecondary" 
            mb={1}
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            <strong>Save smarter. Code faster.</strong> Your personal vault for
            code snippets, templates & hacks.
          </Typography>

          <Typography variant="h6" gutterBottom>
            {isLogin
              ? "Welcome back to CodeCrate 👋"
              : "Let's get you started with CodeCrate 🚀"}
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <TextField
                label="Username"
                type="text"
                fullWidth
                margin="normal"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                error={!!errors.userName}
                helperText={errors.userName}
                InputProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
                InputLabelProps={{
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                }}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
            />
            <Stack sx={{ width: "100%", mt: 2 }}>
              {error && (
                <Alert severity="error" variant="filled">
                  {error}
                </Alert>
              )}
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 , textTransform: "none" }}
            >
              {isLogin ? "Sign in to CodeCrate" : "Create my account"}
            </Button>
          </form>

          {/* Toggle */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            <span style={{ color: "text.secondary" }}>
              {isLogin ? "New here? " : "Already a member? "}
            </span>
            <span
              onClick={toggleMode}
              style={{
                cursor: "pointer",
                color: "#1976d2", 
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.target.style.color = "#115293")} 
              onMouseOut={(e) => (e.target.style.color = "#1976d2")}
            >
              {isLogin
                ? "Create your free CodeCrate account"
                : "Log in instead"}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
