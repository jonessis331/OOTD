import { log } from "~/src/utils/config";
import { normalizeItemName } from "../utils/dataTypes";
const API_KEY = process.env.LYKDAT_API_KEY;

export const searchImage = async (imageUrl: string) => {
  log.info("Entering searchImage function"); // Log added
  const formdata = new FormData();
  formdata.append("api_key", `${API_KEY}`);
  formdata.append("image_url", imageUrl);

  const requestOptions = {
    method: "POST",
    body: formdata,
  };

  try {
    const response = await fetch(
      "https://cloudapi.lykdat.com/v1/global/search",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    //console.error('Error:', error);
    throw error;
  } finally {
    log.info("leaving SearchImage");
  }
};

export const detectItems = async (imageUrl: string) => {
  log.info("Entering detectItems function"); // Log added
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", `${API_KEY}`);

  const formdata = new FormData();
  formdata.append("image_url", imageUrl);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
  };

  try {
    const response = await fetch(
      "https://cloudapi.lykdat.com/v1/detection/items",
      requestOptions
    );
    const result = await response.json();

    log.info("Fetched items from API", result); // Log the fetched result

    const uniqueItems = new Set<string>();
    const filteredItems = result.data.detected_items.filter((item: any) => {
      const normalizedItemName = normalizeItemName(item.name);
      log.info(`Normalized item name: ${normalizedItemName}`); // Log normalized item name
      if (uniqueItems.has(normalizedItemName)) {
        log.info(`Duplicate item found: ${normalizedItemName}`); // Log duplicate item
        return false; // Skip duplicate items
      }
      uniqueItems.add(normalizedItemName);
      return true;
    });

    log.info("Filtered unique items", filteredItems); // Log filtered items

    return { ...result, data: { detected_items: filteredItems } };
  } catch (error) {
    log.error("Error in detectItems:", error); // Log the error
    throw error;
  } finally {
    log.info("Leaving DetectItems");
  }
};

export const getDeepTags = async (imageUrl: string) => {
  log.info("Entering getDeepTags function"); // Log added
  const myHeaders = new Headers();
  myHeaders.append("x-api-key", `${API_KEY}`);

  const formdata = new FormData();
  formdata.append("image_url", imageUrl);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
  };

  try {
    const response = await fetch(
      "https://cloudapi.lykdat.com/v1/detection/tags",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    //console.error('Error:', error);
    throw error;
  } finally {
    log.info("Leaving Get Deep Tags");
  }
};
