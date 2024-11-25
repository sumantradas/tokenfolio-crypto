import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { TrendingUp } from 'lucide-react';
import { fetchCryptos, resetCryptos } from '../store/cryptoSlice';

const CryptoList = lazy(() => import('./CryptoList'));

const CryptoTracker = () => {
  const { cryptos, status, page, hasMore } = useSelector((state) => state.crypto);
  const dispatch = useDispatch();
  const observerTargetRef = useRef(null); // Reference for the observer

  // Fetch initial data
  useEffect(() => {
    if (cryptos.length === 0 && status !== 'loading') {
      dispatch(fetchCryptos(page));
    }
  }, [dispatch, cryptos.length, page, status]);

  // Intersection Observer for Infinite Scrolling
  useEffect(() => {
    if (!observerTargetRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status !== 'loading' && hasMore) {
          dispatch(fetchCryptos(page));
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(observerTargetRef.current);

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, [dispatch, status, page, hasMore]);

  const resetData = () => {
    dispatch(resetCryptos());
    dispatch(fetchCryptos(0));
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
            <Button onClick={resetData}>Refresh Data</Button>
            <CryptoList />
            <div ref={observerTargetRef} style={{ height: '1px' }}></div>
            {status === 'loading' && <Spinner animation="border" />}
            {!hasMore && <p className="text-center">No more data to load</p>}
          </Suspense>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CryptoTracker;
