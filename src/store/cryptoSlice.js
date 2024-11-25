import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithRetry } from '../utils/fetchWithRetry';

// Constants
const SEARCH_HISTORY_LIMIT = 10;
const REFRESH_INTERVAL = 60000; // 1 minute
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch cryptocurrency data. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  NETWORK: 'Network error. Please check your internet connection.',
  INVALID_DATA: 'Received invalid data from the server.',
};

// Validate cryptocurrency data
const validateCryptoData = (data) => {
  if (!Array.isArray(data)) throw new Error('Invalid data format');
  return data.filter(crypto => 
    crypto?.id && 
    crypto?.name && 
    crypto?.symbol && 
    typeof crypto?.priceUsd === 'string'
  );
};

// Thunk actions with proper error handling
export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if we need to fetch new data
      const lastFetched = getState().crypto.lastFetched;
      if (lastFetched && Date.now() - lastFetched < REFRESH_INTERVAL) {
        return null; // Skip fetch if data is fresh
      }

      const response = await fetchWithRetry(
        process.env.REACT_APP_COINCAP_CRYPTO_URL,
        {
          retries: 3,
          retryDelay: 1000,
          timeout: 5000,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(ERROR_MESSAGES.RATE_LIMIT);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = validateCryptoData(data.data);
      return validatedData;

    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue(ERROR_MESSAGES.NETWORK);
      }
      return rejectWithValue(error.message || ERROR_MESSAGES.FETCH_FAILED);
    }
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'crypto/fetchExchangeRates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/data/exchangeRates.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error(ERROR_MESSAGES.INVALID_DATA);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || ERROR_MESSAGES.FETCH_FAILED);
    }
  }
);

// Enhanced initial state with loading states per operation
const initialState = {
  cryptos: [],
  filteredCryptos: [],
  selectedCrypto: null,
  searchTerm: '',
  selectedCurrency: 'USD',
  searchHistory: [],
  loading: {
    cryptos: false,
    exchangeRates: false,
  },
  errors: {
    crypto: null,
    exchangeRate: null,
  },
  lastFetched: null,
  exchangeRates: {},
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      const searchTerm = action.payload.trim().toLowerCase();
      state.searchTerm = searchTerm;
      
      if (searchTerm === '') {
        state.filteredCryptos = state.cryptos;
        return;
      }

      state.filteredCryptos = state.cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm) ||
        crypto.symbol.toLowerCase().includes(searchTerm)
      );
    },

    setSelectedCurrency: (state, action) => {
      const currency = action.payload.toUpperCase();
      if (state.exchangeRates[currency] || currency === 'USD') {
        state.selectedCurrency = currency;
      }
    },

    setSelectedCrypto: (state, action) => {
      state.selectedCrypto = action.payload;
      if (action.payload) {
        state.searchHistory = [
          action.payload,
          ...state.searchHistory
            .filter(item => item.id !== action.payload.id)
            .slice(0, SEARCH_HISTORY_LIMIT - 1)
        ];
      }
    },

    removeFromSearchHistory: (state, action) => {
      state.searchHistory = state.searchHistory.filter(
        crypto => crypto.id !== action.payload
      );
    },

    clearErrors: (state) => {
      state.errors.crypto = null;
      state.errors.exchangeRate = null;
    },

    resetState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Crypto fetching cases
      .addCase(fetchCryptos.pending, (state) => {
        state.loading.cryptos = true;
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.loading.cryptos = false;
        state.errors.crypto = null;
        
        // Only update if we received new data
        if (action.payload) {
          state.cryptos = action.payload;
          state.filteredCryptos = action.payload;
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.loading.cryptos = false;
        state.errors.crypto = action.payload || ERROR_MESSAGES.FETCH_FAILED;
      })

      // Exchange rates cases
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading.exchangeRates = true;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading.exchangeRates = false;
        state.errors.exchangeRate = null;
        state.exchangeRates = action.payload;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading.exchangeRates = false;
        state.errors.exchangeRate = action.payload || ERROR_MESSAGES.FETCH_FAILED;
      });
  },
});

// // Selectors for computed values
// export const selectFormattedPrice = (state, cryptoId) => {
//   const crypto = state.crypto.cryptos.find(c => c.id === cryptoId);
//   const rate = state.crypto.selectedCurrency === 'USD' 
//     ? 1 
//     : state.crypto.exchangeRates[state.crypto.selectedCurrency];

//   if (!crypto || !rate) return null;

//   const price = parseFloat(crypto.priceUsd) * rate;
//   return new Intl.NumberFormat(undefined, {
//     style: 'currency',
//     currency: state.crypto.selectedCurrency,
//   }).format(price);
// };

export const {
  setSearchTerm,
  setSelectedCurrency,
  setSelectedCrypto,
  removeFromSearchHistory,
  clearErrors,
  resetState,
} = cryptoSlice.actions;

export default cryptoSlice.reducer;