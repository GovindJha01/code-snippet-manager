// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import AuthPage from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Settings from "./components/SettingsComp";
import HomeLayout from "./components/home/HomeLayout";
import { CircularProgress, Box } from "@mui/material";

const App = () => {
  const { user, fetchUser, loading } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      fetchUser: state.fetchUser,
      loading: state.loading,
      error: state.error,
    }))
  );


  useEffect(() => {
    // Fetch user data on app load
    const user = async () => {
      await fetchUser();
    };
    user();
  }, []);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />}>
          <Route index element={<HomeLayout />} />
          <Route path="snippets" element={<h1>snippets</h1>} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );   
};

export default App;
