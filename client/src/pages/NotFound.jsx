// src/pages/NotFound.jsx
import { useEffect,useState } from 'react';
import { Box, Typography, Button, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  useEffect(() => {
    // simulate loading (e.g. to allow image + layout to load together)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        textAlign: 'center',
        gap: 1,
        //backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        component="img"
        src="https://storyset.com/images/404/12.svg"
        alt="404 Illustration"
        loading="eager"
        sx={{
          maxWidth: 400,
          width: '100%',
        }}
      />

      <Typography variant="body1" sx={{ maxWidth: 500 }}>
        Looks like you took a wrong turn. The page you are looking for isn’t here.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;
