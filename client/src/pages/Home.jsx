import Sidebar from "../components/home/Sidebar";
import Header from "../components/Header";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useAuthStore from "../store/useAuthStore";
import { useShallow } from "zustand/shallow";
import { useState } from "react";

const Home = () => {
  const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));
  const username = user?.userName || "";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Helmet>
          <title> {username.charAt(0).toUpperCase()+username.slice(1)} | CodeCrate</title>
        </Helmet>
        
        {/* Mobile Drawer Sidebar */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={sidebarOpen}
            onClose={handleSidebarToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 250,
                boxSizing: 'border-box',
              },
            }}
          >
            <Sidebar onClose={handleSidebarToggle} />
          </Drawer>
        ) : (
          /* Desktop Sidebar */
          <Box
            sx={{ 
              width: 250, 
              borderRight: "1px solid rgba(228, 218, 218, 0.5)",
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Sidebar />
          </Box>
        )}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box>
            <Header onMenuClick={handleSidebarToggle} showMenuButton={isMobile} />
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: "flex", overflowY: "hidden" }}>
            {/* Snippet List Panel */}
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
