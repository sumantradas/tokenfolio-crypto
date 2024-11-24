import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Badge } from 'react-bootstrap';
import { History } from 'lucide-react';
import { setSelectedCrypto } from '../store/cryptoSlice';

const SearchHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchHistory } = useSelector(state => state.crypto);

  if (searchHistory.length === 0) return null;

  const handleCryptoSelect = (crypto) => {
    dispatch(setSelectedCrypto(crypto));
    navigate(`/crypto/${crypto.id}`);
  };

  return (
    <div className="mt-4">
      <h5 className="flex items-center gap-2 mb-3">
        <History size={20} />
        Recent Searches
      </h5>
      <ListGroup>
        {searchHistory.map(crypto => (
          <ListGroup.Item
            key={crypto.id}
            action
            className="flex justify-between items-center"
            onClick={() => handleCryptoSelect(crypto)}
          >
            <span>{crypto.name}</span>
            <Badge bg="secondary">{crypto.symbol}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SearchHistory;
