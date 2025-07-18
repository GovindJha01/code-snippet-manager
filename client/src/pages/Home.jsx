import HomeLayout from "../components/home/HomeLayout";
import Sidebar from "../components/home/Sidebar";
import Header from "../components/Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import useAuthStore from "../store/useAuthStore";
import { useShallow } from "zustand/shallow";

const Home = () => {
  const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));
  const username= user?.userName || "";
  return (
    <>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Helmet>
          <title> {username.charAt(0).toUpperCase()+username.slice(1)} | CodeCrate</title>
        </Helmet>
        {/* Sidebar */}
        <Box
          sx={{ width: 250, borderRight: "1px solid rgba(228, 218, 218, 0.5)" }}
        >
          <Sidebar />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{}}>
            <Header />
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
