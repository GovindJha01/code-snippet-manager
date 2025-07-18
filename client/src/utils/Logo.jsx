import { Box, Typography, Avatar } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";

const Logo = () => {
  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      <Avatar
        sx={{
          bgcolor: "#2563eb", // Blue background (same as your button)
          width: 32,
          height: 32,
          fontSize: 20,
        }}
        variant="rounded"
      >
        <CodeIcon fontSize="small" />
      </Avatar>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: "text.primary" }}
      >
        CodeCrate
      </Typography>
    </Box>
  );
};

export default Logo;
