/**
 * Wait for a specified number of milliseconds.
 * @param {number} milliseconds - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
function waitFor(milliseconds: number): Promise<void> {
  const jitter = Math.random() * 100; // Add up to 100ms of jitter
  return new Promise((resolve) => setTimeout(resolve, milliseconds + jitter));
}

  
  /**
   * Execute a promise and retry with exponential backoff
   * based on the maximum retry attempts it can perform.
   * @param {() => Promise<any>} promiseFn - The promise-returning function to be executed.
   * @param {() => void} onRetry - Callback executed on every retry.
   * @param {number} maxRetries - The maximum number of retries to be attempted.
   * @returns {Promise<any>} The result of the given promise passed in.
   */
  async function retryWithBackoff(
    promiseFn: () => Promise<any>,
    onRetry: () => void,
    maxRetries: number
  ): Promise<any> {
    async function retry(retries: number): Promise<any> {
      try {
        if (retries > 0) {
          const timeToWait = 2 ** retries * 100;
          console.log(`Retry attempt ${retries}. Waiting for ${timeToWait}ms...`);
          await waitFor(timeToWait);
        }
        return await promiseFn();
      } catch (e: any) {
        if (e.response?.status === 429 && retries < maxRetries) {
          const retryAfter = e.response.headers['retry-after'];
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2 ** retries * 100;
          console.log(`Rate limited. Waiting for ${waitTime}ms before retrying...`);
          await waitFor(waitTime);
          onRetry();
          return retry(retries + 1);
        } else if (retries < maxRetries) {
          console.warn(`Retry attempt ${retries} failed. Retrying...`);
          onRetry();
          return retry(retries + 1);
        } else {
          console.error("Max retries reached. Bubbling the error up");
          throw e;
        }
      }
    }
    
    
  
    return retry(0);
  }
  
  export { waitFor, retryWithBackoff };