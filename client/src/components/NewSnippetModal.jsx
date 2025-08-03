import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Chip,
  Stack,
  IconButton,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  alpha,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Code as CodeIcon, 
  Add as AddIcon, 
} from '@mui/icons-material';
import { languages } from '../constants/data';
import useSnippetStore from '../store/useSnippetStore';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';



const NewSnippetModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const  { autoSummarize } = useSnippetStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    tags: [],
    code: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  
  useEffect(() => {
    const fetchSummary = async () => {
      if (formData.code) {
        try {
          const summary = await autoSummarize(formData.code);
          const formattedSummary = JSON.parse(summary);
          setTags(formattedSummary.tags);
          setFormData((prev) => ({ ...prev, ...formattedSummary}));
        } catch (error) {
          console.error("Error fetching summary:", error);
        }
      }
    };
    setTimeout(fetchSummary,10000);
  }, [formData.code]);

  const selectedLang = languages.find(lang => lang.value.toLowerCase() === formData.language.toLowerCase());

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.code) return;
    const payload = {
      ...formData,
      language: selectedLang?.value || '',
      tags: tags,
    };
    onSubmit(payload);
    setFormData({ title: '', description: '', language: '', tags: '', code: '' });
    setTags([]);
    setTagInput('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      fullScreen={isMobile}
      slotProps={{
        sx: {
          margin: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : '95vh',
          borderRadius: isMobile ? 0 : 3,
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          p: 3,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              pt: 1.5,
              pb: 0.9,
              pr: 1.5,
              pl: 1.5,
              borderRadius: 2,
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              
            }}
          >
            <CodeIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Create New Snippet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save and organize your code snippets
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mx: 3 }} />

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Title Field */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
              📝 Snippet Title
            </Typography>
            <TextField
              placeholder="Enter a descriptive title for your snippet"
              value={formData.title}
              onChange={handleChange('title')}
              fullWidth
              variant="outlined"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Description Field */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
              📄 Description (Optional)
            </Typography>
            <TextField
              placeholder="Brief description of what this snippet does"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Language Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
              🔧 Programming Language
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedLang?.value || ''}
                onChange={handleChange('language')}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Select a language</Typography>
                </MenuItem>
                {languages.map((lang) => (
                  <MenuItem 
                    key={lang.value} 
                    value={lang.value}
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      py: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>{lang.icon}</Typography>
                      <Typography>{lang.value}</Typography>
                      <Chip 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(lang.color, 0.1),
                          color: lang.color,
                          fontWeight: 500,
                        }}
                        label={lang.value}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Tags Section */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
              🏷️ Tags
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                size="small"
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddTag}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                <AddIcon />
              </Button>
            </Stack>
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Code Editor */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
              💻 Code
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
              }}
            >
              {selectedLang && (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: (theme) => alpha(selectedLang.color, 0.1),
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: '1rem' }}>{selectedLang.icon}</Typography>
                  <Typography variant="body2" fontWeight={500} color={selectedLang.color}>
                    {selectedLang.value}
                  </Typography>
                </Box>
              )}
              <TextField
                placeholder="Paste your code here..."
                value={formData.code}
                onChange={handleChange('code')}
                fullWidth
                multiline
                rows={8}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { 
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontFamily: '"Fira Code", "Cascadia Code", "Monaco", monospace',
                    p: 2,
                    lineHeight: 1.6,
                  }
                }}
              />
            </Paper>
          </Box>

        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          color="secondary"
          sx={{ 
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: 3,
            py: 1,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            }
          }}
        >
          <CodeIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          Create Snippet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSnippetModal;
