import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container, Button } from 'react-bootstrap';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { fetchCryptos } from '../store/cryptoSlice';

const CryptoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCrypto, cryptos, selectedCurrency, exchangeRates } = useSelector(state => state.crypto);

  useEffect(() => {
    if (!selectedCrypto && cryptos.length === 0) {
      dispatch(fetchCryptos());
    }
  }, [dispatch, selectedCrypto, cryptos]);

  const crypto = selectedCrypto || cryptos.find(c => c.id === id);

  if (!crypto) {
    return (
      <Container className="py-4">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        variant="outline-primary"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="inline mr-2" size={20} />
        Back to List
      </Button>

      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h5 className="mb-0">{crypto.name} ({crypto.symbol})</h5>
            <a
              href={`https://coincap.io/assets/${crypto.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-md">
              <h6>Price</h6>
              <p className="h4 mb-0">
                {formatPrice(parseFloat(crypto.priceUsd), selectedCurrency, exchangeRates)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-md">
              <h6>Market Cap Rank</h6>
              <p className="h4 mb-0">#{crypto.rank}</p>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-md">
              <h6>24h Change</h6>
              <p className={`h4 mb-0 text-${parseFloat(crypto.changePercent24Hr) >= 0 ? 'success' : 'danger'}`}>
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-gray-50 rounded-md">
              <h6>Market Cap</h6>
              <p className="h4 mb-0">
                {formatPrice(parseFloat(crypto.marketCapUsd), selectedCurrency, exchangeRates)}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoDetails;