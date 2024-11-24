import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { setSearchTerm, setSelectedCurrency } from '../store/cryptoSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchTerm, selectedCurrency } = useSelector(state => state.crypto);

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

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[300px]">
        <InputGroup>
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
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
  );
};

export default SearchBar;