// src/components/Games/CompletionGame.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Avatar,
  Grid,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { getColorFromUserId } from '../../utils/colorUtils';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';

const CompletionGame = () => {
  const { sessionId } = useParams();
  const { auth } = useContext(AuthContext);

  const [story, setStory] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // State to map user_id to color
  const [colorMap, setColorMap] = useState({});

  // Current turn information
  const [currentTurn, setCurrentTurn] = useState(null);

  // Function to fetch the story and current turn from the backend
  const fetchGameState = async () => {
    try {
      const response = await api.get('/get_completion_state', {
        params: { session_id: sessionId },
      });
      setStory(response.data.story);
      setCurrentTurn(response.data.current_turn); // Assuming backend returns 'current_turn'

      // Update colorMap for new users
      const updatedColorMap = { ...colorMap };
      response.data.story.forEach((step) => {
        const userId = step.user_id;
        if (!updatedColorMap[userId]) {
          updatedColorMap[userId] = getColorFromUserId(userId);
        }
      });
      setColorMap(updatedColorMap);
    } catch (err) {
      console.error('Failed to fetch game state:', err);
      setError('Failed to fetch game state');
    }
  };

  // Polling to fetch game state every 3 seconds
  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [sessionId]);

  // Handle submitting a new contribution
  const handleSubmit = async () => {
    if (!input.trim()) {
      toast.error('Input cannot be empty');
      return;
    }
    try {
      const data = {
        session_id: sessionId,
        content: input.trim(),
      };
      const response = await api.post('/completion_step', data);
      toast.success(response.data.message);
      setInput('');
      fetchGameState(); // Fetch updated story after submission
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit');
      toast.error('Failed to submit');
    }
  };

  // Function to download the storyboard as a .txt file
  const downloadStoryboard = () => {
    try {
      const storyText = story.map((step) => step.content).join(' ');
      const blob = new Blob([storyText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `storyboard_session_${sessionId}_${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
      toast.success('Storyboard downloaded successfully!');
    } catch (err) {
      console.error('Failed to download storyboard:', err);
      toast.error('Failed to download storyboard');
    }
  };

  // Determine if it's the current user's turn
  const isUserTurn =
    currentTurn &&
    (auth.user
      ? currentTurn === auth.user.sub
      : currentTurn === localStorage.getItem('guest_user_id'));

  return (
    <Container maxWidth="md" sx={{ p: 2 }}>
      <Box sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* User Color Indicator */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: auth.user
                    ? colorMap[auth.user.sub] || '#000000'
                    : getColorFromUserId(localStorage.getItem('guest_user_id') || 'GUEST'),
                  width: 40,
                  height: 40,
                }}
              >
                {auth.user
                  ? auth.user.sub.charAt(0).toUpperCase()
                  : localStorage.getItem('guest_user_id')
                  ? localStorage.getItem('guest_user_id').charAt(0).toUpperCase()
                  : 'G'}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Your Color
              </Typography>
            </Box>
          </Grid>

          {/* Current Turn Indicator */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Current Turn:
              </Typography>
              {currentTurn ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colorMap[currentTurn] || '#000000',
                      width: 24,
                      height: 24,
                    }}
                  >
                    {currentTurn.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2">
                    {currentTurn === auth.user?.sub
                      ? 'You'
                      : `User: ${currentTurn}`}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="subtitle2">Waiting for game to start...</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Story Board */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          minHeight: '200px',
          backgroundColor: '#f5f5f5',
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Story Board
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
          {story.map((step, index) => {
            const userColor = colorMap[step.user_id] || '#000000';
            return (
              <span key={index} style={{ color: userColor }}>
                {step.content + ' '}
              </span>
            );
          })}
        </Typography>
      </Paper>

      {/* Contribution Input and Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Your Contribution"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isUserTurn}
          multiline
          rows={2}
          sx={{
            flex: 1,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isUserTurn}
          endIcon={<SendIcon />}
          sx={{
            height: '56px',
            minWidth: '120px',
          }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={downloadStoryboard}
          endIcon={<DownloadIcon />}
          sx={{
            height: '56px',
            minWidth: '160px',
          }}
        >
          Download Story
        </Button>
      </Box>

      {/* Disable input and provide feedback if not user's turn */}
      {!isUserTurn && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">It's not your turn yet.</Alert>
        </Box>
      )}
    </Container>
  );
};

export default CompletionGame;
