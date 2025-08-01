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
import { languages } from "../../constants/data"; 

const SnippetList = ({ onSnippetSelect }) => {
  const { filteredSnippets, fetchSnippets, selectSnippet, selectedSnippet } =
    useSnippetStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSnippets();
  }, []); 

  const handleSnippetClick = (snippet) => {
    selectSnippet(snippet);
    if (onSnippetSelect) {
      onSnippetSelect();
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 }, 
        height: "100%",
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight={600} 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.1rem', sm: '1.25rem' } 
        }}
      >
        Recent Snippets
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {filteredSnippets.map((snippet) => {
        const isSelected = selectedSnippet?._id === snippet._id;
        const langColor = languages.find(
          (lang) => lang.value === snippet.language
        )?.color || "#1976d2";
        const isOwner = user?._id === snippet.admin?._id;

        return (
          <Paper
            key={snippet._id}
            elevation={isSelected ? 4 : 1}
            onClick={() => selectSnippet(snippet)}
            
            sx={{
              p: { xs: 1.5, sm: 2 }, // Less padding on mobile
              mb: { xs: 1.5, sm: 2 }, // Less margin on mobile
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
              sx={{ 
                color: "#1a73e8", 
                mb: 1,
                fontSize: { xs: '0.9rem', sm: '1rem' } // Smaller on mobile
              }}
            >
              {snippet.title}
            </Typography>

            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap" 
              mb={1} 
              gap={0.5}
              sx={{
                '& .MuiChip-root': {
                  fontSize: { xs: '0.6rem', sm: '0.7rem' }, // Smaller chips on mobile
                  height: { xs: '20px', sm: '24px' }
                }
              }}
            >
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
              sx={{ 
                mb: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' } // Smaller on mobile
              }}
              noWrap
            >
              {snippet.description || snippet.code?.slice(0, 120)}
            </Typography>

            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={0.5} 
              sx={{ flexWrap: 'wrap', gap: 0.5 }} 
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarTodayIcon
                  sx={{ fontSize: { xs: 14, sm: 16 }, color: "text.disabled" }}
                />
                <Typography 
                  variant="caption" 
                  color="text.disabled"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  {dayjs(snippet.createdAt).format("DD MMM YYYY")}
                </Typography>
              </Stack>
              
              {/* Author section */}
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ 
                  fontStyle: "italic", 
                  whiteSpace: "nowrap",
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
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
