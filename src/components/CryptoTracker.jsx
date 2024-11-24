import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { fetchCryptos } from '../store/cryptoSlice';
import SearchBarWithHistory from './SearchBarWithHistory';

// const SearchBar = lazy(() => import('./SearchBar'));
const CryptoList = lazy(() => import('./CryptoList'));
// const SearchHistory = lazy(() => import('./SearchHistory'));


const CryptoTracker = () => {
const { cryptos, status, lastFetched } = useSelector(state => state.crypto);

  const dispatch = useDispatch();

  useEffect(() => {
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const shouldRefetch = 
      cryptos.length === 0 || 
      (lastFetched && Date.now() - lastFetched > REFRESH_INTERVAL);

    if (shouldRefetch && status !== 'loading') {
      dispatch(fetchCryptos());
    }
  }, [dispatch, cryptos.length, status, lastFetched]);


  function fetchDataCryptos() {
    dispatch(fetchCryptos());
  }



  // if polling is necessary 

//   useEffect(() => {
//     const POLLING_INTERVAL = 30 * 1000; // 30 seconds
  
//     const intervalId = setInterval(() => {
//       // Ensure the API is called every 30 seconds
//       if (status !== 'loading') {
//         dispatch(fetchCryptos());
//       }
//     }, POLLING_INTERVAL);
  
//     // Clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [dispatch, status]);

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
            <Button onClick={fetchDataCryptos}>Refresh Data</Button>
            <CryptoList />
            {/* <SearchHistory /> */}
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;