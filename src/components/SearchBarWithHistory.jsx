import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { Search, History, X } from 'lucide-react';
import { setSearchTerm, setSelectedCurrency, setSelectedCrypto, removeFromSearchHistory } from '../store/cryptoSlice';

const SearchBarWithHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const { searchTerm, selectedCurrency, searchHistory } = useSelector(state => state.crypto);

  const currencies = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    CHF: { symbol: 'Fr', name: 'Swiss Franc' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCurrencyChange = (e) => {
    dispatch(setSelectedCurrency(e.target.value));
  };

  const handleCryptoSelect = (crypto) => {
    dispatch(setSelectedCrypto(crypto));
    dispatch(setSearchTerm(crypto.name));
    setIsFocused(false);
    navigate(`/crypto/${crypto.id}`);
  };

  const handleRemoveFromHistory = (e, cryptoId) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    dispatch(removeFromSearchHistory(cryptoId));
  };

  return (
    <div className="relative" style={{ marginBottom: isFocused && searchHistory.length ? '160px' : '24px' }}>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <InputGroup>
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
            />
          </InputGroup>

          {/* Search History Suggestions */}
          {isFocused && searchHistory.length > 0 && (
            <div 
              className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg"
              style={{
                position: 'absolute',
                maxHeight: '160px',
                overflowY: 'auto'
              }}
            >
              {searchHistory.map(crypto => (
                <div
                  key={crypto.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b last:border-b-0 group"
                  onClick={() => handleCryptoSelect(crypto)}
                >
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-gray-400" />
                    <span>{crypto.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      bg="secondary" 
                      className="ml-2"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {crypto.symbol}
                    </Badge>
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-2 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleRemoveFromHistory(e, crypto.id)}
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Form.Select
          className="w-[200px]"
          value={selectedCurrency}
          onChange={handleCurrencyChange}
        >
          {Object.entries(currencies).map(([code, { name }]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
};

export default SearchBarWithHistory;