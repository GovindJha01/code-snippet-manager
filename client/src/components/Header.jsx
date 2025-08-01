import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  Avatar,
  Stack,
  alpha,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useSnippetStore from "../store/useSnippetStore";
import { useShallow } from "zustand/react/shallow";

const Header = ({ onMenuClick, showMenuButton = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));

  const { snippets, setFilteredSnippets } = useSnippetStore(
    useShallow((state) => ({
      snippets: state.snippets,
      setFilteredSnippets: state.setFilteredSnippets,
    }))
  );

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) {
      setFilteredSnippets(snippets);
    } else {
      const lower = query.toLowerCase();
      const filtered = snippets.filter((s) => {
        const tagsMatch = s.tags?.some((tag) =>
          tag.toLowerCase().includes(lower)
        );
        return (
          s.title.toLowerCase().includes(lower) ||
          s.language.toLowerCase().includes(lower) ||
          s.admin?.userName?.toLowerCase().includes(lower) ||
          tagsMatch
        );
      });
      setFilteredSnippets(filtered);
    }
  }, [query, snippets, setFilteredSnippets]);

  return (
    <AppBar
      position="static"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid rgba(228, 218, 218, 0.5)",
        px: { xs: 1, sm: 2, md: 3 }, 
        py: 0.3,
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: "space-between", 
          minHeight: { xs: "56px", sm: "64px", md: "68px" }, 
          px: { xs: 0, sm: 1, md: 0 } 
        }}
      >
        {/* Menu Button for Mobile */}
        {showMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: { xs: 1, sm: 2 } }} // Less margin on mobile
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar */}
        <Box
          sx={{
            position: "relative",
            borderRadius: { xs: 1, sm: 2 },
            border: "1px solid #9ca3af",
            backgroundColor: alpha("#cbd5e1", 0.1),
            height: { xs: "36px", sm: "42px" }, 
            ml: showMenuButton ? 0 : { xs: 1, sm: 3, md: 4 },
            mr: { xs: 1, sm: 2 },
            "&:hover": {
              backgroundColor: alpha("#cbd5e1", 0.15),
            },
            width: { 
              xs: showMenuButton ? "calc(100% - 120px)" : "calc(100% - 100px)",
              sm: "65%",
              md: "70%",
              lg: "60%"
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              pl: { xs: 1.5, sm: 2, md: 2 },
              pointerEvents: "none",
              color: "#6b7280",
              zIndex: 1,
              top: 0,
            }}
          >
            <SearchIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
          </Box>
          <InputBase
            placeholder={isMobile ? "Search snippets..." : "Search snippets by title, tags, language or author…"}
            sx={{
              color: "inherit",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center", 
              pl: { 
                xs: "calc(1.5rem + 18px + 0.5rem)",
                sm: "calc(2rem + 20px + 0.5rem)",   
                md: "calc(2rem + 22px + 0.5rem)"    
              },
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" }, // Larger font on desktop
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        {/* Profile Section */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={{ xs: 0.5, sm: 1, md: 1.5 }} // Better spacing on desktop
          sx={{ minWidth: "fit-content" }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: { xs: 30, sm: 34, md: 36 }, 
              height: { xs: 30, sm: 34, md: 36 },
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              fontWeight: 500,
            }}
          >
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          {/* Hide username on very small screens */}
          {!isMobile && (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ 
                color: "inherit", 
                textTransform: "capitalize",
                display: { sm: "block" },
                fontSize: { sm: "0.875rem", md: "1rem", lg: "1.1rem" } // Better font size progression
              }}
            >
              {user?.userName || "User"}
            </Typography>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
