import { configureStore } from '@reduxjs/toolkit'
import vehiclesReducer from './vehicleSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    auth: authReducer,
  },
})

export default store
