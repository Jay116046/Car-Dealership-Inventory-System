import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const readStoredUser = () => {
  try {
    const storedValue = localStorage.getItem('carInventoryUser')
    return storedValue ? JSON.parse(storedValue) : null
  } catch {
    return null
  }
}

const initialState = {
  user: readStoredUser(),
  status: 'idle',
  error: null,
}

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/authcheck`, {
        withCredentials: true,
      })

      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unauthorized')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.messege || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, payload, {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    clearAuthSession(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('carInventoryUser')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
        localStorage.setItem('carInventoryUser', JSON.stringify(action.payload))
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.error = action.payload
        localStorage.removeItem('carInventoryUser')
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        localStorage.setItem('carInventoryUser', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        localStorage.removeItem('carInventoryUser')
      })
  },
})

export const { clearAuthError, clearAuthSession } = authSlice.actions
export default authSlice.reducer
