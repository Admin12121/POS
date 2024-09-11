export async function fetchDataWithRetry(customHook: any, params: any, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const result = await customHook(params); 
        return result;
      } catch (error) {
        console.error('Error fetching data:', error);
        retries++;
        console.log(retries)
        console.log(`Retrying... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries))); 
      }
    }
  
    throw new Error('Failed to fetch data after maximum retries');
}
