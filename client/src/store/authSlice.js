import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/user/login', credentials);
    localStorage.setItem('isLoggedIn', 'true');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await api.post('/user/logout');
  localStorage.removeItem('isLoggedIn');
  return response.data;
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async () => {
  try {
    const response = await api.get('/user/check-auth');
    return response.data;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = { isLoggedIn: true };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = { isLoggedIn: true };
        state.status = 'succeeded';
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.status = 'failed';
      });
  },
});

export default authSlice.reducer;

