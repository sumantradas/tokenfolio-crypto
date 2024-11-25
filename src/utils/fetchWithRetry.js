export const fetchWithRetry = async (url, options = {}) => {
  const { retries = 3, retryDelay = 1000, timeout = 5000 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        ...options 
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};