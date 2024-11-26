import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { fetchCryptos, fetchExchangeRates, clearErrors } from '../store/cryptoSlice';
import SearchBarWithHistory from './SearchBarWithHistory';
import { isEmptyObject } from '../utils/isEmptyObject';

const CryptoList = lazy(() => import('./CryptoList'));

const CryptoTracker = () => {
  const { cryptos, status, lastFetched, exchangeRates, errors } = useSelector(state => state.crypto);

  const dispatch = useDispatch();

  useEffect(() => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const shouldRefetch = 
      cryptos.length === 0 || 
      (lastFetched && Date.now() - lastFetched > REFRESH_INTERVAL);

    if (shouldRefetch && status !== 'loading') {
      dispatch(clearErrors());
      dispatch(fetchCryptos());
    }
  }, [dispatch, cryptos.length, status, lastFetched]);

  useEffect(() => {
    if (isEmptyObject(exchangeRates)) {
      dispatch(fetchExchangeRates());
    }
  }, [dispatch, exchangeRates]);

  function fetchDataCryptos() {
    dispatch(clearErrors()); // Clear any previous errors
    dispatch(fetchCryptos());
  }

  const renderErrorMessage = () => {
    if (errors.crypto || errors.exchangeRate) {
      return (
        <div className="mb-3 space-y-2">
          {errors.crypto && typeof errors.crypto === 'string' &&(
            <Alert variant="danger" className="text-sm">
              Error fetching cryptocurrencies: {errors.crypto}
            </Alert>
          )}
          {errors.exchangeRate && typeof errors.exchangeRate === 'string' && (
            <Alert variant="danger" className="text-sm">
              Error fetching exchange rates: {errors.exchangeRate}
            </Alert>
          )}
        </div>
      );
    }
    return null;
  };
  

  return (
    <Container className="py-2 sm:py-4 px-2 sm:px-4">
      <Card className="w-full">
        <Card.Header className="bg-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold mb-0">Token Folio</h4>
            </div>
            <Button 
              onClick={fetchDataCryptos} 
              variant="outline-primary" 
              className="flex items-center gap-2 p-2 text-sm"
              disabled={status === 'loading'}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-3 sm:p-4">
          <Suspense fallback={
            <div className="flex justify-center items-center h-40">
              <Spinner animation="border" variant="primary" />
            </div>
          }>
            {renderErrorMessage()} 
            <div className="mb-3">
              <SearchBarWithHistory />
            </div>
            <CryptoList />
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;