import axios from 'axios'; // Import axios

export const scrapUrl = async (cropUrl: string) => {
  try {
    // Construct the ScraperAPI URL with your API key and the URL you want to scrape
    const apiKey = '36d1ef13a6905df230a1f181a1b7f579';
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(cropUrl)}&render=true&autoparse=true`;

    // Make a GET request to the ScraperAPI endpoint
    const { data } = await axios.get(scraperApiUrl);
    console.log('here')

    console.log('Scraped Data:', data); // Log the scraped data
    return data; // Return the scraped data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow or handle as needed
  }
};
