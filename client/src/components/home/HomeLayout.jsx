import { Box } from "@mui/material";
import SnippetList from "./SnippetList";
import SnippetPreview from "./SnippetPreview";


const HomeLayout = () => {
  return (
    <>
      <Box
        sx={{
          width: 300,
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
