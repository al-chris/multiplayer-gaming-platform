// src/components/Search/SearchComponent.js

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
} from '@mui/material';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], sessions: [] });
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query.');
      return;
    }
    try {
      const response = await api.get('/search', {
        params: { query: query.trim() },
      });
      setResults(response.data);
      toast.success('Search completed');
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    }
  };

  // Function to download search results as a .txt file
  const downloadSearchResults = () => {
    try {
      const userText = results.users
        .map((user) => `User: ${user.username || 'Anonymous'} (ID: ${user.id})`)
        .join('\n');
      const sessionText = results.sessions
        .map(
          (session) =>
            `Session: ${session.session_id} | Game Type: ${session.game_type} | Mode: ${session.mode || 'N/A'} | Participants: ${session.participants_count} | Active: ${session.is_active}`
        )
        .join('\n');
      const combinedText = `--- Users ---\n${userText}\n\n--- Sessions ---\n${sessionText}`;
      const blob = new Blob([combinedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `search_results_${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Search results downloaded!');
    } catch (err) {
      console.error('Failed to download search results:', err);
      toast.error('Failed to download search results');
    }
  };

  return (
    <Container maxWidth="md" sx={{ p: 2 }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Search Users and Sessions
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Download Button */}
        {results.users.length > 0 || results.sessions.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={downloadSearchResults}
              startIcon={<DownloadIcon />}
            >
              Download Results
            </Button>
          </Box>
        ) : null}
      </Box>

      {/* Search Results */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          {/* Users List */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              {results.users.length > 0 ? (
                <List>
                  {results.users.map((user) => (
                    <ListItem key={user.id} divider>
                      <ListItemText
                        primary={user.username || 'Anonymous'}
                        secondary={`ID: ${user.id}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No users found.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Sessions List */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sessions
              </Typography>
              {results.sessions.length > 0 ? (
                <List>
                  {results.sessions.map((session) => (
                    <ListItem key={session.session_id} divider alignItems="flex-start">
                      <ListItemText
                        primary={`Game: ${session.game_type}`}
                        secondary={`Session ID: ${session.session_id} | Mode: ${session.mode || 'N/A'} | Participants: ${session.participants_count} | Active: ${session.is_active ? 'Yes' : 'No'}`}
                      />
                      <Button
                        variant="outlined"
                        component={Link}
                        to={`/game/completion/${session.session_id}`}
                        sx={{ ml: 2 }}
                      >
                        Join
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No sessions found.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchComponent;
