import React, { useEffect } from 'react';
import { Container, CssBaseline, Typography, Button, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import Login from './components/Login';
import Register from './components/Register';
import { logout, checkAuthStatus } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Task Management App
        </Typography>
        {user ? (
          <>
            <Button onClick={handleLogout} variant="outlined" sx={{ mb: 2 }}>
              Logout
            </Button>
            <AddTaskForm />
            <TaskList />
          </>
        ) : (
          <>
            <Login />
            <Register />
          </>
        )}
      </Container>
    </>
  );
}

export default App;

