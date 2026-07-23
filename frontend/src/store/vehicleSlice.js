import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const initialState = {
  list: [],
  status: 'idle',
  error: null,
  purchaseStatus: 'idle',
  adminStatus: 'idle',
}

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/vehicles/getList`)
      return response.data.data || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.messege || 'Unable to fetch vehicles')
    }
  }
)

export const purchaseVehicle = createAsyncThunk(
  'vehicles/purchaseVehicle',
  async (vehicleId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/vehicles/${vehicleId}/purchase`,
        {},
        { withCredentials: true }
      )
      await dispatch(fetchVehicles())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Purchase failed')
    }
  }
)

export const addVehicle = createAsyncThunk(
  'vehicles/addVehicle',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/vehicles/add`, payload, {
        withCredentials: true,
      })
      await dispatch(fetchVehicles())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.messege || 'Unable to add vehicle')
    }
  }
)

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`${API_URL}/api/admin/vehicles/update/${id}`, data, {
        withCredentials: true,
      })
      await dispatch(fetchVehicles())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.messege || 'Unable to update vehicle')
    }
  }
)

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/vehicles/delete/${id}`, {
        withCredentials: true,
      })
      await dispatch(fetchVehicles())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.messege || 'Unable to delete vehicle')
    }
  }
)

export const restockVehicle = createAsyncThunk(
  'vehicles/restockVehicle',
  async ({ id, amount }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/vehicles/restock/${id}`,
        { amount },
        { withCredentials: true }
      )
      await dispatch(fetchVehicles())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Unable to restock vehicle')
    }
  }
)

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(purchaseVehicle.pending, (state) => {
        state.purchaseStatus = 'loading'
      })
      .addCase(purchaseVehicle.fulfilled, (state) => {
        state.purchaseStatus = 'succeeded'
      })
      .addCase(purchaseVehicle.rejected, (state, action) => {
        state.purchaseStatus = 'failed'
        state.error = action.payload
      })
      .addCase(addVehicle.pending, (state) => {
        state.adminStatus = 'loading'
      })
      .addCase(addVehicle.fulfilled, (state) => {
        state.adminStatus = 'succeeded'
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.adminStatus = 'failed'
        state.error = action.payload
      })
      .addCase(updateVehicle.pending, (state) => {
        state.adminStatus = 'loading'
      })
      .addCase(updateVehicle.fulfilled, (state) => {
        state.adminStatus = 'succeeded'
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.adminStatus = 'failed'
        state.error = action.payload
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.adminStatus = 'loading'
      })
      .addCase(deleteVehicle.fulfilled, (state) => {
        state.adminStatus = 'succeeded'
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.adminStatus = 'failed'
        state.error = action.payload
      })
      .addCase(restockVehicle.pending, (state) => {
        state.adminStatus = 'loading'
      })
      .addCase(restockVehicle.fulfilled, (state) => {
        state.adminStatus = 'succeeded'
      })
      .addCase(restockVehicle.rejected, (state, action) => {
        state.adminStatus = 'failed'
        state.error = action.payload
      })
  },
})

export default vehicleSlice.reducer
