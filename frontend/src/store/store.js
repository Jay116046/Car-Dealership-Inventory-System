import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import vehiclesReducer from './vehicleSlice'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    orders: orderReducer,
  },
})

export default store
