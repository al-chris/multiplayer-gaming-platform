// src/components/Games/QuestionsGame.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { TextField, Button, Typography, Container, Box, List, ListItem, ListItemText, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const QuestionsGame = () => {
  const { sessionId } = useParams();
  const { auth } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  // Polling for updates every 3 seconds
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await api.get('/get_questions_state', {
          params: { session_id: sessionId },
        });
        setQuestions(response.data.questions);
        // Optionally, manage answers and scoring
      } catch (err) {
        console.error('Failed to fetch game state:', err);
        setError('Failed to fetch game state');
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[questions.length - 1]);
    }
  }, [questions]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Answer cannot be empty');
      return;
    }
    try {
      const data = {
        session_id: sessionId,
        question: currentQuestion,
        answer: answer.trim(),
      };
      const response = await api.post('/questions_step', data);
      toast.success(response.data.message);
      setAnswer('');
      // Optionally, fetch updated state
      setQuestions([...questions, currentQuestion]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit answer');
      toast.error('Failed to submit answer');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          20 Questions Game - Session ID: {sessionId}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Questions:</Typography>
          {questions.length > 0 ? (
            <List>
              {questions.map((q, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Q${index + 1}: ${q}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No questions yet.</Typography>
          )}
        </Box>
        {currentQuestion && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Current Question:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {currentQuestion}
            </Typography>
            <TextField
              label="Your Answer"
              variant="outlined"
              fullWidth
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Answer
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QuestionsGame;
