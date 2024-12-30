import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import api from '../api/axiosConfig';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/register', { username, password });
      setSuccess(true);
      setError('');
      console.log('Registration successful:', response.data);
    } catch (error) {
      setError('Error registering user: ' + (error.response?.data?.message || error.message));
      setSuccess(false);
      console.error('Registration error:', error.response?.data || error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" sx={{ mb: 2 }}>
          User registered successfully. You can now login.
        </Typography>
      )}
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;

