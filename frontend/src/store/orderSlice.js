import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { clearAuthSession } from './authSlice';

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(clearAuthSession());
      }
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create order');
    }
  }
);

// Async thunk for fetching user's orders
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/api/orders/my-orders');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(clearAuthSession());
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user orders');
    }
  }
);

// Async thunk for admin to get all orders
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/api/orders/all');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(clearAuthSession());
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch all orders');
    }
  }
);

// Async thunk for admin to update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, progressStatus }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, { progressStatus });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(clearAuthSession());
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update order status');
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
  createStatus: 'idle',
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        if (action.payload?.order) {
          state.orders = [action.payload.order, ...state.orders];
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || 'Failed to create order';
      })
      // getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user orders';
      })
      // getAllOrders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch all orders';
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        if (updatedOrder) {
          const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
          if (index !== -1) {
            state.orders[index] = { ...state.orders[index], ...updatedOrder };
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order status';
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
