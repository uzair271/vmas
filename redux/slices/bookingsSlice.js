import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  count: 0,
  services: [],
};

// Create slice
export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    bookService: (state, action) => {
      state.count += 1;
      state.services.push(action.payload);
    },
    removeService: (state, action) => {
      state.count = Math.max(state.count - 1, 0);
      state.services = state.services.filter(service => service.id !== action.payload);
    },
    resetBookings: (state) => {
      state.count = 0;
      state.services = [];
    },
  },
});

// Export actions
export const { bookService, removeService, resetBookings } = bookingsSlice.actions;

// Export reducer
export default bookingsSlice.reducer;
