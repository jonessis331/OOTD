import axios from "axios";
import { logger } from "react-native-logs";

const log = logger.createLogger();

export const scrapUrl = async (cropUrl: string) => {
  log.info("Entering Scraping URL");
  try {
    const apiKey = process.env.SCRAPER_API_KEY;
    const scraperApiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
      cropUrl
    )}&render=true&autoparse=true`;
    const { data } = await axios.get(scraperApiUrl);
    return data;
  } catch (error) {
    log.error("Error fetching data:", error);
    throw error;
  } finally {
    log.info("leaving Scrap Url (scraperapi)");
  }
};

export const scrapUrlWithBeeScraper = async (productUrl: string) => {
  log.info("Scraping with BeeScraper:", productUrl);
  const apiKey = process.env.SCRAPERBEE_API_KEY;
  try {
    const response = await axios.get("https://app.scrapingbee.com/api/v1/", {
      params: {
        api_key: `${apiKey}`,
        url: productUrl,
        json_response: "true",
      },
    });
    return response.data.metadata;
  } catch (error) {
    log.error("Error in BeeScraper:", error);
    throw error;
  } finally {
    log.info("leaving beescraper");
  }
};
