import {
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";
import { Edit, Delete, ContentCopy, Save, Close } from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import useSnippetStore from "../../store/useSnippetStore";
import useAuthStore from "../../store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

const SnippetPreview = () => {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const { selectedSnippet, deleteSnippet, updateSnippet, error } =
    useSnippetStore(
      useShallow((state) => ({
        selectedSnippet: state.selectedSnippet,
        deleteSnippet: state.deleteSnippet,
        updateSnippet: state.updateSnippet,
        error: state.error,
      }))
    );

  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");

  useEffect(() => {
    if (selectedSnippet?.code) {
      setEditedCode(selectedSnippet.code);
    }
  }, [selectedSnippet]);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedSnippet?._id]);

  if (!selectedSnippet) {
    return (
      <Box sx={{ p: 4, color: "text.secondary" }}>
        <Typography variant="h6">Select a snippet to view details</Typography>
      </Box>
    );
  }

  const {
    title,
    description,
    code,
    language,
    tags = [],
    _id,
    admin,
  } = selectedSnippet;

  const isOwner = user?._id === admin._id;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error("Copy failed", err));
  };

  const handleDeleteConfirm = async () => {
    const res = await deleteSnippet(_id);
    setDeleteDialogOpen(false);
    setToast({
      open: true,
      message: res.success ? "Snippet deleted successfully!" : error,
      severity: res.success ? "success" : "error",
    });
  };

  const handleSave = async () => {
    if (!isOwner) {
      return setToast({
        open: true,
        message: "You are not authorized to edit this snippet.",
        severity: "error",
      });
    }

    const res = await updateSnippet(_id, {
      ...selectedSnippet,
      code: editedCode,
    });

    if (res.success) {
      setToast({
        open: true,
        message: "Snippet updated!",
        severity: "success",
      });
      setIsEditing(false);
    } else {
      setToast({
        open: true,
        message: error || "Failed to update",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, width: "100%", height: "100%" }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
        spacing={1}
        sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }} // Allow wrapping only on very small screens
      >
        <Typography 
          variant="h5" 
          fontWeight={600}
          sx={{ 
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            flex: 1, // Take available space
            minWidth: 0, // Allow text to shrink
          }}
        >
          {title}
        </Typography>
        {language && (
          <Chip
            label={language}
            color="primary"
            size="small"
            sx={{ 
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              flexShrink: 0,
            }}
          />
        )}
      </Stack>

      {description && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            color: "text.secondary",
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}
        >
          {description}
        </Typography>
      )}
      {tags.length > 0 && (
        <Stack
          direction="row" // Keep horizontal layout
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flex: 1 }}>
            {tags.map((tag, i) => (
              <Chip
                key={`${tag}-${i}`}
                label={tag}
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              />
            ))}
          </Stack>
          {admin && (
            <Typography
              variant="caption"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                whiteSpace: "nowrap",
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                flexShrink: 0, // Don't shrink the author text
              }}
            >
              By {admin._id === user?._id ? "me" : admin.userName}
            </Typography>
          )}
        </Stack>
      )}

      <Box sx={{ mt: 3 }}>
        {isEditing ? (
          <Box
            component="textarea"
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            rows={12}
            spellCheck={false}
            style={{
              width: "100%",
              fontSize: window.innerWidth < 600 ? "0.8rem" : "0.9rem", // Smaller font on mobile
              fontFamily: "monospace",
              background: "#282c34",
              color: "#fff",
              padding: window.innerWidth < 600 ? "0.5rem" : "1rem", // Less padding on mobile
              borderRadius: "8px",
              border: "1px solid #444",
              resize: "vertical",
              whiteSpace: "pre",
              overflowX: "auto",
            }}
          />
        ) : (
          <SyntaxHighlighter
            language={language || "text"}
            style={oneDark}
            wrapLongLines
            customStyle={{
              borderRadius: 8,
              fontSize: window.innerWidth < 600 ? "0.8rem" : "0.9rem", 
              padding: window.innerWidth < 600 ? "0.5rem" : "1rem", 
              marginTop: "1.5rem",
              overflowX: "auto", 
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </Box>

      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mt: 2,
          justifyContent: { xs: 'center', sm: 'flex-start' }, // Center on mobile
          flexWrap: 'wrap'
        }}
      >
        {isEditing ? (
          <>
            <Tooltip title="Cancel">
              <IconButton onClick={() => setIsEditing(false)}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton onClick={handleSave}>
                <Save fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  if (!isOwner) {
                    return setToast({
                      open: true,
                      message: "You are not authorized to edit this snippet.",
                      severity: "error",
                    });
                  }
                  setIsEditing(true);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => setDeleteDialogOpen(true)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Snippet copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Snippet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{title}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SnippetPreview;
