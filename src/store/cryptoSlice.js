import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos',
  async () => {
    const response = await fetch(process.env.REACT_APP_COINCAP_CRYPTO_URL);
    const data = await response.json();
    return data.data;
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'crypto/fetchExchangeRates',
  async () => {
    const response = await fetch('/data/exchangeRates.json');
    const data = await response.json();
    return data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptos: [],
    filteredCryptos: [],
    selectedCrypto: null,
    searchTerm: '',
    selectedCurrency: 'USD',
    searchHistory: [],
    loading: false,
    error: null,
    lastFetched: null,
    exchangeRates: {},
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredCryptos = state.cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    setSelectedCrypto: (state, action) => {
      state.selectedCrypto = action.payload;
      if (action.payload) {
        state.searchHistory = [
          action.payload,
          ...state.searchHistory.filter(item => item.id !== action.payload.id).slice(0, 9)
        ];
      }
    },
    removeFromSearchHistory: (state, action) => {
        state.searchHistory = state.searchHistory.filter(
          crypto => crypto.id !== action.payload
        );
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptos = action.payload;
        state.filteredCryptos = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload; // Update exchangeRates dynamically
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.error = action.error.message;
      });
      
  },
});

export const { setSearchTerm, setSelectedCurrency, setSelectedCrypto , removeFromSearchHistory} = cryptoSlice.actions;
export default cryptoSlice.reducer;