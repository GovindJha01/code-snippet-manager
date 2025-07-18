import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useEffect } from "react";
import useSnippetStore from "../../store/useSnippetStore";
import useAuthStore from "../../store/useAuthStore";
import dayjs from "dayjs";

const languageColorMap = {
  JavaScript: "#FFD600",
  Python: "#4CAF50",
  CSS: "#E91E63",
  HTML: "#FF5722",
  Cpp: "#2196F3",
  C: "#00BCD4",
};

const SnippetList = () => {
  const { filteredSnippets, fetchSnippets, selectSnippet, selectedSnippet } =
    useSnippetStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Recent Snippets
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {filteredSnippets.map((snippet) => {
        const isSelected = selectedSnippet?._id === snippet._id;
        const langColor = languageColorMap[snippet.language] || "#1976d2";
        const isOwner = user?._id === snippet.admin?._id;

        return (
          <Paper
            key={snippet._id}
            elevation={isSelected ? 4 : 1}
            onClick={() => selectSnippet(snippet)}
            
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              
              position: "relative",
              cursor: "pointer",
              transition: "0.2s",
              border: isSelected
                ? "1px solid #2196f3"
                : "1px solid transparent",
              backgroundColor:(theme) => theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff",
              "&:hover": {
                boxShadow: 3,
              },
            }}
          >
            {/* Blue dot indicator */}
            {isSelected && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#2196f3",
                }}
              />
            )}

            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{ color: "#1a73e8", mb: 1 }}
            >
              {snippet.title}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1} gap={0.5}>
              {snippet.language && (
                <Chip
                  label={snippet.language}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    backgroundColor: langColor,
                    color: "#fff",
                  }}
                />
              )}
              {snippet.tags?.map((tag, idx) => (
                <Chip
                  key={tag + idx + snippet._id}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? "#333" : "#e0e0e0",
                    color: (theme) =>
      theme.palette.mode === "dark" ? "#fff" : "#000",
                  }}
                />
              ))}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
              noWrap
            >
              {snippet.description || snippet.code?.slice(0, 120)}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarTodayIcon
                sx={{ fontSize: 16, color: "text.disabled" }}
              />
              <Typography variant="caption" color="text.disabled">
                {dayjs(snippet.createdAt).format("DD MMM YYYY")}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ ml: 1, fontStyle: "italic", whiteSpace: "nowrap" }}
              >
                • By {isOwner ? "me" : snippet.admin?.userName || "unknown"}
              </Typography>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default SnippetList;
