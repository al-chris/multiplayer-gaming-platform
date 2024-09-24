// src/components/Sessions/CreateSession.js

import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import BuildIcon from '@mui/icons-material/Build';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';

const CreateSession = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [gameType, setGameType] = useState('completion');
  const [mode, setMode] = useState('word');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // State to hold session details after creation
  const [sessionDetails, setSessionDetails] = useState(null);

  // Handle session creation
  const handleCreate = async () => {
    try {
      const data = {
        game_type: gameType,
        mode: gameType === 'completion' ? mode : null,
      };
      const response = await api.post('/create_session', data);
      setSessionDetails(response.data); // Assuming response contains session_id and creator_id
      setMessage(`Session created! ID: ${response.data.session_id}`);
      toast.success('Session created successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create session');
      toast.error('Failed to create session');
    }
  };

  // Handle Generate Button click
  const handleGenerate = async () => {
    try {
      await api.post('/generate_story', { session_id: sessionDetails.session_id });
      toast.success('Story enhancement initiated!');
      // Optionally, update the UI or notify users
    } catch (err) {
      toast.error('Failed to initiate story enhancement');
      console.error('Generate story error:', err);
    }
  };

  // Handle navigation to the game after session creation
  const handleJoinGame = () => {
    navigate(`/game/completion/${sessionDetails.session_id}`);
  };

  return (
    <Container maxWidth="sm" sx={{ p: 2 }}>
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create New Session
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        {!sessionDetails ? (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="game-type-label">Game Type</InputLabel>
              <Select
                labelId="game-type-label"
                value={gameType}
                label="Game Type"
                onChange={(e) => setGameType(e.target.value)}
              >
                <MenuItem value="completion">Completion Game</MenuItem>
                <MenuItem value="questions">20 Questions</MenuItem>
              </Select>
            </FormControl>
            {gameType === 'completion' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="mode-label">Mode</InputLabel>
                <Select
                  labelId="mode-label"
                  value={mode}
                  label="Mode"
                  onChange={(e) => setMode(e.target.value)}
                >
                  <MenuItem value="word">Word</MenuItem>
                  <MenuItem value="sentence">Sentence</MenuItem>
                  <MenuItem value="paragraph">Paragraph</MenuItem>
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              fullWidth
              startIcon={<PlayCircleOutlineIcon />}
              sx={{ height: '56px' }}
            >
              Create Session
            </Button>
          </>
        ) : (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Session Created Successfully!
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                <strong>Session ID:</strong> {sessionDetails.session_id}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Share this ID with other players to join the session.
              </Typography>
              <Grid container spacing={2}>
                {/* Generate Button - Visible Only to Session Creator */}
                <Grid item xs={12} sm={6}>
                  {auth.user && sessionDetails.creator_id === auth.user.sub ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleGenerate}
                      startIcon={<BuildIcon />}
                      sx={{ height: '56px' }}
                    >
                      Generate Story
                    </Button>
                  ) : null}
                </Grid>

                {/* Join Game Button */}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={handleJoinGame}
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{ height: '56px' }}
                  >
                    Join Game
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CreateSession;
