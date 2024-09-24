// src/components/Auth/Guest.js

import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const Guest = () => {
  const { setGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = React.useState('');

  const handleGuestLogin = async () => {
    try {
      const response = await api.post('/create_temp_user');
      setGuest(response.data.user_id);
      toast.success('Entered as Guest');
      navigate('/');
    } catch (err) {
      setError('Failed to create guest user');
      toast.error('Guest login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Continue as Guest
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleGuestLogin}>
            Enter as Guest
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Guest;
