import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from './slices/bookingsSlice'; // Import new slice

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer, // Add reducer here
  },
});

export default store;
