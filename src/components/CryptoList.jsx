import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCrypto } from '../store/cryptoSlice';
import { formatPrice } from '../utils/formatters';

const CryptoList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, filteredCryptos, selectedCurrency, exchangeRates } = useSelector(state => state.crypto);

  const handleCryptoSelect = (crypto) => {
    dispatch(setSelectedCrypto(crypto));
    navigate(`/crypto/${crypto.id}`);
  };

  if (loading.cryptos) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <svg 
            className="animate-spin h-10 w-10 mx-auto text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4">
      {filteredCryptos.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-xl">
            No cryptocurrencies found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCryptos.map(crypto => (
            <div 
              key={crypto.id}
              className="
                bg-white 
                shadow-sm 
                rounded-lg 
                p-3 
                flex 
                items-center 
                justify-between
                hover:shadow-md 
                transition-all 
                duration-300 
                cursor-pointer 
                border 
                border-transparent 
                hover:border-blue-200
              "
              onClick={() => handleCryptoSelect(crypto)}
            >
              {/* Left Section - Rank, Symbol, Name */}
              <div className="flex items-center space-x-3">
                <span className="
                  bg-gray-100 
                  text-gray-700 
                  rounded-full 
                  w-7 
                  h-7 
                  flex 
                  items-center 
                  justify-center 
                  text-sm 
                  font-bold
                ">
                  {crypto.rank}
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">
                    {crypto.symbol}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[100px]">
                    {crypto.name}
                  </span>
                </div>
              </div>

              {/* Right Section - Price, Change */}
              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-900 text-sm">
                  {formatPrice(parseFloat(crypto.priceUsd), selectedCurrency, exchangeRates)}
                </span>
                <span 
                  className={`
                    text-xs 
                    font-medium 
                    px-1.5 
                    py-0.5 
                    rounded 
                    mt-1
                    ${
                      parseFloat(crypto.changePercent24Hr) >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }
                  `}
                >
                  {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoList;