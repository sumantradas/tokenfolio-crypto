import React, { useState, useEffect } from 'react';
import { Container, Card, Form, InputGroup, Button, 
         Badge, ListGroup, Spinner } from 'react-bootstrap';
import { Search, TrendingUp, History, ExternalLink } from 'lucide-react';

const CryptoTracker = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const currencies = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    CHF: { symbol: 'Fr', name: 'Swiss Franc' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
  };

  // Fetch top 50 cryptocurrencies
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch('https://api.coincap.io/v2/assets?limit=50');
        const data = await response.json();
        setCryptos(data.data);
        setFilteredCryptos(data.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  useEffect(() => {
    setExchangeRates({
      USD: 1,
      EUR: 0.91,
      GBP: 0.79,
      CHF: 0.89,
      INR: 83.25,
    });
  }, []);

  useEffect(() => {
    const filtered = cryptos.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, [searchTerm, cryptos]);

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    const updatedHistory = [
      crypto,
      ...searchHistory.filter(item => item.id !== crypto.id).slice(0, 9)
    ];
    setSearchHistory(updatedHistory);
  };

  const formatPrice = (price, currency) => {
    const convertedPrice = price * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(convertedPrice);
  };

  // Custom CSS for Flexbox layouts
  const styles = {
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: '1 1 300px',
    },
    currencySelect: {
      flex: '0 1 200px',
    },
    cryptoList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    cryptoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.375rem',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
    },
    cryptoDetails: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginTop: '1rem',
    },
    detailBox: {
      flex: '1 1 200px',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.375rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <div style={styles.header}>
            <TrendingUp />
            <h4 className="mb-0">Token Folio</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Search and Currency Selection */}
          <div style={styles.searchContainer}>
            <div style={styles.searchInput}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <Form.Select
              style={styles.currencySelect}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {Object.entries(currencies).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Crypto List */}
          {loading ? (
            <div className="d-flex justify-content-center p-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div style={styles.cryptoList}>
              {filteredCryptos.map(crypto => (
                <div
                  key={crypto.id}
                  style={styles.cryptoItem}
                  onClick={() => handleCryptoSelect(crypto)}
                  className="hover-shadow"
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="fw-bold">#{crypto.rank}</span>
                    <span className="fw-bold">{crypto.symbol}</span>
                    <span>{crypto.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>{formatPrice(parseFloat(crypto.priceUsd), selectedCurrency)}</span>
                    <Badge bg={parseFloat(crypto.changePercent24Hr) >= 0 ? 'success' : 'danger'}>
                      {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Crypto Details */}
          {selectedCrypto && (
            <Card className="mt-4">
              <Card.Header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="mb-0">{selectedCrypto.name} ({selectedCrypto.symbol})</h5>
                  <a
                    href={`https://coincap.io/assets/${selectedCrypto.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={styles.cryptoDetails}>
                  <div style={styles.detailBox}>
                    <h6>Price</h6>
                    <p className="h4 mb-0">{formatPrice(parseFloat(selectedCrypto.priceUsd), selectedCurrency)}</p>
                  </div>
                  <div style={styles.detailBox}>
                    <h6>Market Cap Rank</h6>
                    <p className="h4 mb-0">#{selectedCrypto.rank}</p>
                  </div>
                  <div style={styles.detailBox}>
                    <h6>24h Change</h6>
                    <p className={`h4 mb-0 text-${parseFloat(selectedCrypto.changePercent24Hr) >= 0 ? 'success' : 'danger'}`}>
                      {parseFloat(selectedCrypto.changePercent24Hr).toFixed(2)}%
                    </p>
                  </div>
                  <div style={styles.detailBox}>
                    <h6>Market Cap</h6>
                    <p className="h4 mb-0">{formatPrice(parseFloat(selectedCrypto.marketCapUsd), selectedCurrency)}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <h5 className="d-flex align-items-center gap-2 mb-3">
                <History size={20} />
                Recent Searches
              </h5>
              <ListGroup>
                {searchHistory.map(crypto => (
                  <ListGroup.Item
                    key={crypto.id}
                    action
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => handleCryptoSelect(crypto)}
                  >
                    <span>{crypto.name}</span>
                    <Badge bg="secondary">{crypto.symbol}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;