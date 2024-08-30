import axios from 'axios'; // Import axios

export const scrapUrl = async (cropUrl: string) => {
  console.log("Entering scrapUrl function"); // Log added
  try {
    // Construct the ScraperAPI URL with your API key and the URL you want to scrape
    const apiKey = '36d1ef13a6905df230a1f181a1b7f579';
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(cropUrl)}&render=true&autoparse=true`;

    // Make a GET request to the ScraperAPI endpoint
    const { data } = await axios.get(scraperApiUrl);
    //console.log('here')

    //console.log('Scraped Data:', data); // Log the scraped data
    return data; // Return the scraped data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    console.log("Leaving scrapUrl function");
  }
};

export const scrapUrlWithBeeScraper = async (productUrl: string) => {
  // request Axios
  console.log("Entering ScrapUrlWithBeeScraper")
  try {

    axios
      .get("https://app.scrapingbee.com/api/v1/", {
        params: {
          api_key:
            "A3SL65KI0SG9O5QL7Y5NZI22GYO664YB48HAKX1E48PQME8NX0FTTMSYO9HYVRPBVQQCNE7FQZZKGZBN",
          url: productUrl,
          json_response: "true",

        },
      })
      .then(function (response) {
        // handle success
        //console.log(JSON.stringify(response.data.metadata, null, 4));
        return JSON.stringify(response.data.metadata, null, 6)
      });
  } catch (error) {
    console.log("Error ScrapurlBeee", error)
  } finally{
    console.log("Leaving ScrapUrlWithBeeScraper")
  }
};