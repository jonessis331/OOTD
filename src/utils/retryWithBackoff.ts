/**
 * Wait for a specified number of milliseconds.
 * @param {number} milliseconds - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
function waitFor(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
          console.log(`Waiting for ${timeToWait}ms...`);
          await waitFor(timeToWait);
        }
        return await promiseFn();
      } catch (e) {
        if (retries < maxRetries) {
          onRetry();
          return retry(retries + 1);
        } else {
          console.warn("Max retries reached. Bubbling the error up");
          throw e;
        }
      }
    }
  
    return retry(0);
  }
  
  export { waitFor, retryWithBackoff };