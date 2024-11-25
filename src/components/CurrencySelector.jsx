import React from 'react';
import { Form } from 'react-bootstrap';
import {setSelectedCurrency } from '../store/cryptoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { currencies } from '../constants/currencies';



const CurrencySelector = () => {

  const dispatch = useDispatch();

  const handleCurrencyChange = (e) => {
    dispatch(setSelectedCurrency(e.target.value));
  };

  const { selectedCurrency } = useSelector(state => state.crypto);

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
