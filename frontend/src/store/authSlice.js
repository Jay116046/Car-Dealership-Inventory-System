import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/axios';

const readStoredUser = () => {
  try {
    const storedValue = localStorage.getItem('carInventoryUser');
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: readStoredUser(),
  role: readStoredUser()?.role || null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};


export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/authcheck');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unauthorized');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', payload);
      console.log(response);

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // If backend has a logout endpoint, call it here.
      // await api.post('/api/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthSession(state) {
      state.user = null;
      state.role = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('carInventoryUser');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {

        state.status = 'succeeded';
        state.user = action.payload;
        state.role = action.payload.role;
        state.error = null;
        localStorage.setItem('carInventoryUser', JSON.stringify(action.payload));
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.role = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem('carInventoryUser');
        localStorage.removeItem('token');
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        localStorage.setItem('carInventoryUser', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.role = null;
        state.token = null;
        localStorage.removeItem('carInventoryUser');
        localStorage.removeItem('token');
      });
  },
});

export const { clearAuthError, clearAuthSession } = authSlice.actions;
export default authSlice.reducer;
