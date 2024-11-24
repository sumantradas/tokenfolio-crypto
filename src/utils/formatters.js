export const formatPrice = (price, currency) => {
    const exchangeRates = {
      USD: 1,
      EUR: 0.91,
      GBP: 0.79,
      CHF: 0.89,
      INR: 83.25,
    };
  
    const convertedPrice = price * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(convertedPrice);
  };