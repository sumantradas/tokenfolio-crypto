import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Card, Spinner } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { fetchCryptos } from '../store/cryptoSlice';
import SearchBarWithHistory from './SearchBarWithHistory';

// const SearchBar = lazy(() => import('./SearchBar'));
const CryptoList = lazy(() => import('./CryptoList'));
// const SearchHistory = lazy(() => import('./SearchHistory'));

const CryptoTracker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCryptos());
  }, [dispatch]);

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
            {/* <SearchBar /> */}
            <SearchBarWithHistory/>
            <CryptoList />
            {/* <SearchHistory /> */}
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;