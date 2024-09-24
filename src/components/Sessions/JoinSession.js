// src/components/Sessions/JoinSession.js

import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const JoinSession = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a valid Session ID');
      toast.error('Please enter a valid Session ID');
      return;
    }
    try {
      const data = { session_id: sessionId.trim() };
      const response = await api.post('/join_session', data);

      setMessage(response.data.message);
      toast.success('Joined session successfully');

      // Redirect to the game page
      // You need to fetch session details to determine game type
      // For simplicity, assume you know the game type or have another API to fetch it
      // Here, we'll redirect to a generic game page, but ideally, fetch the game type first
      // For this example, we'll assume it's a completion game
      // TODO: Implement fetching session details to determine game type
      navigate(`/game/completion/${sessionId.trim()}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to join session');
      toast.error('Failed to join session');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Join Existing Session
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        <TextField
          label="Session ID"
          variant="outlined"
          fullWidth
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleJoin}>
          Join Session
        </Button>
      </Box>
    </Container>
  );
};

export default JoinSession;
