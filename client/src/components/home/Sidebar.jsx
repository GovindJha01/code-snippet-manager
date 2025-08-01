import {
  Box,
  Button,
  Divider,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { Logout, Home, Code, Settings } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useSnippetStore from "../../store/useSnippetStore";
import NewSnippetModal from "../NewSnippetModal";
import { useState } from "react";
import Logo from "../../utils/Logo";

const Sidebar = ({ onClose }) => {
  const [openModal, setOpenModal] = useState(false);
  const createSnippet = useSnippetStore((state) => state.createSnippet);
  const { logout } = useAuthStore();

  const navItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "Snippets", path: "/snippets", icon: <Code /> },
    { text: "Settings", path: "/settings", icon: <Settings /> },
  ];

  const handleCreateSnippet = async (snippetData) => {
    await createSnippet(snippetData); //  API call
    setOpenModal(false); //  close modal
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (onClose) {
      onClose();
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1c1c1c" : "#ffffff",
        color: (theme) => theme.palette.text.primary,
        p: 2,
        height: "100%",
      }}
    >
      <Box display="flex" alignItems="center" mb={1} p={1}>
        <Logo />
      </Box>
      <Divider sx={{ my: 1 }} />

      <Button
        onClick={() => setOpenModal(true)}
        fullWidth
        disableElevation
        variant="contained"
        color="primary"
        sx={{ mb: 2, textTransform: "none" }}
      >
        + New Snippet
      </Button>

      <List>
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.text}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#1976d2" : "inherit",
            })}
          >
            <ListItemButton onClick={handleNavClick}>
              <ListItemIcon sx={{ minWidth: 32 }}> {item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </NavLink>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
      <NewSnippetModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateSnippet}
      />
    </Box>
  );
};

export default Sidebar;
