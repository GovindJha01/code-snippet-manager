import { Box, useMediaQuery, useTheme, Fab } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SnippetList from "./SnippetList";
import SnippetPreview from "./SnippetPreview";
import useSnippetStore from "../../store/useSnippetStore";

const HomeLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPreview, setShowPreview] = useState(false);
  const { selectedSnippet, selectSnippet } = useSnippetStore();
  const location = useLocation();

  // Reset to list view when component mounts or location changes
  useEffect(() => {
    setShowPreview(false);
  }, [location.pathname]);

  // Handle mobile/desktop view switching
  useEffect(() => {
    if (!isMobile) {
      setShowPreview(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && selectedSnippet && !showPreview) {
      setShowPreview(true);
    } else if (isMobile && !selectedSnippet && showPreview) {
      setShowPreview(false);
    }
  }, [isMobile, selectedSnippet, showPreview]);

  const handleBackToList = () => {
    setShowPreview(false);
    selectSnippet(null);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile: Show either list or preview */}
        {!showPreview ? (
          // Snippet List View
          <Box sx={{ width: '100%', overflowY: "auto" }}>
            <SnippetList onSnippetSelect={() => setShowPreview(true)} />
          </Box>
        ) : (
          // Snippet Preview View
          <Box sx={{ width: '100%', overflowY: "auto", position: 'relative' }}>
            {/* Back Button */}
            <Fab
              size="small"
              color="primary"
              aria-label="back"
              onClick={handleBackToList}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1000,
                backgroundColor: 'primary.main',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: 6,
                }
              }}
            >
              <ArrowBackIcon />
            </Fab>
            <Box sx={{ pt: 6 }}> {/* Add padding to avoid overlap with back button */}
              <SnippetPreview />
            </Box>
          </Box>
        )}
      </>
    );
  }

  // Desktop/Tablet: Show both panels
  return (
    <>
      <Box
        sx={{
          width: { sm: 350, md: 300 },
          overflowY: "auto",
          borderRight: "1px solid rgba(228, 218, 218, 0.5)",
        }}
      >
        <SnippetList />
      </Box>

      {/* Snippet Preview Panel */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <SnippetPreview />
      </Box>
    </>
  );
};

export default HomeLayout;
