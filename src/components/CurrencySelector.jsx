import React from 'react';
import { Form } from 'react-bootstrap';

const CurrencySelector = ({ selectedCurrency, currencies, handleCurrencyChange }) => {
  return (
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
  );
};

export default CurrencySelector;
