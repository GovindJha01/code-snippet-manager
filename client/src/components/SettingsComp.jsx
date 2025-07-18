import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
  Checkbox,
} from "@mui/material";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import { useShallow } from "zustand/react/shallow";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const SettingsComp = () => {
  const { user, updateUser, deleteAccount } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      updateUser: state.updateUser,
      deleteAccount: state.deleteAccount,
    }))
  );

  const { mode, toggleTheme } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      toggleTheme: state.toggleTheme,
    }))
  );

  const [userName, setUserName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  useEffect(() => {
    setUserName(user?.userName || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleProfileUpdate = () => {
    if (!userName || !email) {
      alert("Both fields are required to update!");
      return;
    }
    updateUser({ userName, email });
  };

  const handlePasswordUpdate = () => {
    console.log("Password updated", oldPassword, newPassword);
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      deleteAccount();
    }
  };

  return (
    <Box sx={{ p: 4, overflowY: "auto", height: "100%", width: "100%" }}>
      <Typography variant="h5" fontWeight={600}>
        Settings
      </Typography>

      <Typography variant="h7" fontWeight={100}>
        Manage your account settings and preferences
      </Typography>

      {/* Profile Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, mt: 2 }}>
        <Typography variant="h6" mb={2}>
          Profile
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar>{user?.userName?.[0]?.toUpperCase()}</Avatar>
          <Box>
            <Typography fontWeight={500} sx={{ textTransform: "capitalize" }}>{user.userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Joined on {dayjs(user.createdAt).format("DD MMM YYYY")}
            </Typography>
          </Box>
        </Stack>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          disableElevation
          sx={{ mt: 2, textTransform: "none" }}
          onClick={handleProfileUpdate}
        >
          Update Profile
        </Button>
      </Paper>

      {/* Preferences Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Preferences
        </Typography>
        <FormControlLabel
          control={<Switch checked={mode === "dark"} onChange={toggleTheme} />}
          label="Enable Dark Mode"
        />
        <Box mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            }
            label="Receive Email Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={weeklySummary}
                onChange={(e) => setWeeklySummary(e.target.checked)}
              />
            }
            label="Receive Weekly Summary Email"
          />
        </Box>
      </Paper>

      {/* Security Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Security
        </Typography>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="warning"
          disableElevation
          sx={{ mt: 2, textTransform: "none" }}
          onClick={handlePasswordUpdate}
        >
          Update Password
        </Button>
      </Paper>

      {/* Danger Zone */}
      <Paper elevation={1} sx={{ p: 3, border: "1px solid red" }}>
        <Typography variant="h6" mb={2} color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" mb={2}>
          Deleting your account is permanent and cannot be undone.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteAccount}
          sx={{ textTransform: "none" }}
        >
          Delete Account
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsComp;
