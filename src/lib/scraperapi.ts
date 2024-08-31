import axios from "axios";
import { logger } from "react-native-logs";

const log = logger.createLogger();

export const scrapUrl = async (cropUrl: string) => {
  log.info("Scraping URL:", cropUrl);
  try {
    const apiKey = "36d1ef13a6905df230a1f181a1b7f579";
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
      cropUrl
    )}&render=true&autoparse=true`;
    const { data } = await axios.get(scraperApiUrl);
    return data;
  } catch (error) {
    log.error("Error fetching data:", error);
    throw error;
  }
};

export const scrapUrlWithBeeScraper = async (productUrl: string) => {
  log.info("Scraping with BeeScraper:", productUrl);
  try {
    const response = await axios.get("https://app.scrapingbee.com/api/v1/", {
      params: {
        api_key: "A3SL65KI0SG9O5QL7Y5NZI22GYO664YB48HAKX1E48PQME8NX0FTTMSYO9HYVRPBVQQCNE7FQZZKGZBN",
        url: productUrl,
        json_response: "true",
      },
    });
    return response.data.metadata;
  } catch (error) {
    log.error("Error in BeeScraper:", error);
    throw error;
  }
};
