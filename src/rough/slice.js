import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos',
  async (page, { getState }) => {
    const limit = 50; // Number of items per page
    const offset = page * limit; // Calculate offset based on page
    const response = await fetch(`${process.env.REACT_APP_COINCAP_CRYPTO_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptos: [],
    page: 0,
    hasMore: true, // To check if more data is available
    status: 'idle',
    error: null,
  },
  reducers: {
    resetCryptos: (state) => {
      state.cryptos = [];
      state.page = 0;
      state.hasMore = true;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.length === 0) {
          state.hasMore = false; // No more data to fetch
        } else {
          state.cryptos = [...state.cryptos, ...action.payload]; // Append new data
          state.page += 1; // Increment page
        }
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetCryptos } = cryptoSlice.actions;
export default cryptoSlice.reducer;
