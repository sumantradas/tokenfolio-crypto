import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Spinner } from 'react-bootstrap';
import { setSelectedCrypto } from '../store/cryptoSlice';
import { formatPrice } from '../utils/formatters';

const CryptoList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, filteredCryptos, selectedCurrency } = useSelector(state => state.crypto);

  const handleCryptoSelect = (crypto) => {
    dispatch(setSelectedCrypto(crypto));
    navigate(`/crypto/${crypto.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredCryptos.map(crypto => (
        <div
          key={crypto.id}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleCryptoSelect(crypto)}
        >
          <div className="flex gap-4 items-center">
            <span className="font-bold">#{crypto.rank}</span>
            <span className="font-bold">{crypto.symbol}</span>
            <span>{crypto.name}</span>
          </div>
          <div className="flex gap-4 items-center">
            <span>{formatPrice(parseFloat(crypto.priceUsd), selectedCurrency)}</span>
            <Badge bg={parseFloat(crypto.changePercent24Hr) >= 0 ? 'success' : 'danger'}>
              {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoList;