import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  Avatar,
  Stack,
  alpha,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useSnippetStore from "../store/useSnippetStore";
import { useShallow } from "zustand/react/shallow";

const Header = () => {
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
        //bgcolor: "#fff",
        borderBottom: "1px solid rgba(228, 218, 218, 0.5)",
        px: 3,
        py: 0.3,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px" }}>
        {/* Search Bar */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            border: "1px solid #9ca3af",
            backgroundColor: alpha("#cbd5e1", 0.1),
            height: "100%",
            ml: 4,
            "&:hover": {
              backgroundColor: alpha("#cbd5e1", 0.1),
            },
            width: { xs: "100%", sm: "70%" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              display: "flex",
              alignItems: "center",
              pl: 2,
              pointerEvents: "none",
              color: "#6b7280",
            }}
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search snippets by title, tags, language or author…"
            sx={{
              color: "inherit",
              width: "100%",
              pl: 5,
              py: 1.2,
              fontSize: "0.9rem",
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        {/* Profile Section */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 34,
              height: 34,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ color: "inherit", textTransform: "capitalize" ,fontWeight: 600}}
          >
            {user?.userName || "User"}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
