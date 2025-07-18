import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';
import { useState } from 'react';

const languages = ['JavaScript', 'Python', 'C++', 'HTML', 'CSS', 'Java'];

const NewSnippetModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    tags: '',
    code: '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.code) return;
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    onSubmit(payload);
    setFormData({ title: '', description: '', language: '', tags: '', code: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Snippet</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={handleChange('title')}
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            select
            label="Language"
            value={formData.language}
            onChange={handleChange('language')}
            fullWidth
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange('tags')}
            fullWidth
          />
          <TextField
            label="Code"
            value={formData.code}
            onChange={handleChange('code')}
            fullWidth
            multiline
            rows={6}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSnippetModal;
