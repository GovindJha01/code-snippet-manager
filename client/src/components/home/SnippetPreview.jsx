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
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
        {language && (
          <Chip
            label={language}
            color="primary"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        )}
      </Stack>

      {description && (
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          {description}
        </Typography>
      )}
      {tags.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, flexWrap: "wrap" }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag, i) => (
              <Chip
                key={`${tag}-${i}`}
                label={tag}
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
          {admin && (
            <Typography
              variant="caption"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                ml: 2,
                whiteSpace: "nowrap",
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
              fontSize: "0.9rem",
              fontFamily: "monospace",
              background: "#282c34",
              color: "#fff",
              padding: "1rem",
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
              fontSize: "0.9rem",
              padding: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
