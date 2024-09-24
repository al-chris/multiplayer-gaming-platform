// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Guest from './components/Auth/Guest';
import CreateSession from './components/Sessions/CreateSession';
import JoinSession from './components/Sessions/JoinSession';
import CompletionGame from './components/Games/CompletionGame';
import QuestionsGame from './components/Games/QuestionsGame';
import SearchComponent from './components/Search/SearchComponent';
import PrivateRoute from './components/Layout/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography, Container } from '@mui/material';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/guest" element={<Guest />} />

            <Route
              path="/create-session"
              element={
                <PrivateRoute>
                  <CreateSession />
                </PrivateRoute>
              }
            />
            <Route
              path="/join-session"
              element={
                <PrivateRoute>
                  <JoinSession />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/game/completion/:sessionId"
              element={
                <PrivateRoute>
                  <CompletionGame />
                </PrivateRoute>
              }
            />
            <Route
              path="/game/questions/:sessionId"
              element={
                <PrivateRoute>
                  <QuestionsGame />
                </PrivateRoute>
              }
            />
            {/* Add a catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

const Home = () => (
  <div style={{ padding: '20px' }}>
    <Typography variant="h3" gutterBottom>
      Welcome to the Multiplayer Gaming Platform
    </Typography>
    <Typography variant="body1">
      Select a game to start playing!
    </Typography>
  </div>
);

const NotFound = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Typography variant="h4" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="body1">
      The page you are looking for does not exist.
    </Typography>
  </Container>
);

export default App;
