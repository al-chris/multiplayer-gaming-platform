// src/components/Auth/Register.js

import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatError = (errorData) => {
    if (!errorData) return 'Registration failed';
    if (typeof errorData === 'string') return errorData;
    if (Array.isArray(errorData)) return errorData.join(', ');
    if (typeof errorData === 'object') {
      // Extract messages from the object
      return Object.values(errorData).flat().join(', ');
    }
    return 'Registration failed';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', {
        username: form.username,
        password: form.password,
      });

      setSuccessMsg(response.data.message || 'User registered successfully');
      setError('');
      toast.success('Registered successfully');
      navigate('/login');
    } catch (err) {
      // Extract error message from the response
      const errorDetail = err.response?.data?.detail;
      const formattedError = formatError(errorDetail);
      setError(formattedError);
      setSuccessMsg('');
      toast.error('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {/* Display Success Message */}
        {successMsg && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            {successMsg}
          </Alert>
        )}
        {/* Display Error Message */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
