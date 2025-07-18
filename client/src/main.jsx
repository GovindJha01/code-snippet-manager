import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import useThemeStore from "./store/useThemeStore";
import { HelmetProvider } from "react-helmet-async";

// Wrapper component to inject Zustand theme dynamically
const ThemeWrapper = () => {
  const mode = useThemeStore((state) => state.mode);
  const [theme, setTheme] = useState(createTheme({ palette: { mode } }));

  useEffect(() => {
    setTheme(createTheme({ palette: { mode } }));
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeWrapper />
    </HelmetProvider>
  </StrictMode>
);
