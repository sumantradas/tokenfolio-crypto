import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { fetchCryptos, fetchExchangeRates, clearcryptoError } from '../store/cryptoSlice';
import SearchBarWithHistory from './SearchBarWithHistory';
import { isEmptyObject } from '../utils/isEmptyObject';

const CryptoList = lazy(() => import('./CryptoList'));


const CryptoTracker = () => {
  const { cryptos, status, lastFetched, exchangeRates, cryptoError, exchangeRateError } = useSelector(state => state.crypto);

  const dispatch = useDispatch();

  useEffect(() => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const shouldRefetch = 
      cryptos.length === 0 || 
      (lastFetched && Date.now() - lastFetched > REFRESH_INTERVAL);

    if (shouldRefetch && status !== 'loading') {
      dispatch(clearcryptoError());
      dispatch(fetchCryptos());
    }
  }, [dispatch, cryptos.length, status, lastFetched]);

  useEffect(() => {
    if (isEmptyObject(exchangeRates)) {
      dispatch(fetchExchangeRates());
    }
  }, [dispatch, exchangeRates]);

  function fetchDataCryptos() {
    dispatch(clearcryptoError()); // Clear any previous errors
    dispatch(fetchCryptos());
  }

  const renderErrorMessage = () => {
    console.log('cryptoError:', cryptoError);
console.log('exchangeRateError:', exchangeRateError);
    if (cryptoError || exchangeRateError) {
      return (
        <div className="mb-3">
          {cryptoError && typeof cryptoError === 'string' && (
            <Alert variant="danger">Error fetching cryptocurrencies: {cryptoError}</Alert>
          )}
          {exchangeRateError && typeof exchangeRateError === 'string' && (
            <Alert variant="danger">Error fetching exchange rates: {exchangeRateError}</Alert>
          )}
        </div>
      );
    }
    return null;
  };
  

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2 mb-0">
            <TrendingUp />
            <h4 className="mb-0">Token Folio</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <Suspense fallback={<Spinner animation="border" />}>
            {renderErrorMessage()} 
            <SearchBarWithHistory />
            <Button onClick={fetchDataCryptos}>Refresh Data</Button>
            <CryptoList />
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;
