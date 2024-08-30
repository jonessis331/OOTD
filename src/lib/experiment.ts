// import axios from 'axios';

const cheerio = require('react-native-cheerio')
import axios from "axios";

// Synonym groups for fashion tags
import { synonymGroups, categoryMap, brandNames} from "../utils/config";

// Assuming synonymGroups is already imported from the config file

// Invert the synonym groups for easier lookup
const synonymMap = Object.keys(synonymGroups).reduce((map, key) => {
  synonymGroups[key].forEach(synonym => map[synonym] = key);
  return map;
}, {} as { [key: string]: string });

const normalizeTag = (tag: string): string => {
  return synonymMap[tag] || tag;
};

const categorizeTag = (tag: string): string => {
  return categoryMap[normalizeTag(tag)] || "other";
};

const isBrand = (word: string): boolean => {
  return brandNames.includes(word) || /^[A-Z][a-zA-Z]*$/.test(word); // Checks for capitalized word
};

export const fetchAndParseWebpage = async (url: string) => {
  try {
      const response = await axios.get(url, { headers });
      const html = response.data;
      const $ = cheerio.load(html);

      const pageText = $('body').text().toLowerCase().replace(/[^a-z\s]/g, ' ');
      const paragraph = pageText.replace(/\s+/g, ' ');
      const words = pageText.split(/\s+/).filter(Boolean);

      const foundTags = new Set<string>();
      let brand = '';
      let materialTags = [];

      // Prioritize earlier words
      for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const normalizedWord = normalizeTag(word);

          if (!brand && isBrand(word)) {
              brand = word;
              continue;
          }

          if (synonymMap[word] && categorizeTag(normalizedWord) !== "other") {
              foundTags.add(normalizedWord);

              if (categorizeTag(normalizedWord) === "material") {
                  materialTags.push(normalizedWord);
              }
          }
      }

      const tagsArray = Array.from(foundTags);

      // Return brand, material tags, and other relevant tags
      return {
          paragraph,
          brand,
          materialTags,
          otherTags: tagsArray.filter(tag => !materialTags.includes(tag)),
      };

  } catch (error) {
      console.error('Error fetching and parsing:', error);
      return {};
  }
};
// import axios from "axios";


// const URL =
//   "https://www.asos.com/us/asos-design/asos-design-cargo-shorts-in-brown/prd/205855460";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
};



interface ProductInfo {
  name: string;
  style: string;
  fit: string;
  material: string;
  careInstructions: string;
  about: string,
  description: string,
  fitTips: string,
}

export const fetchProductInfo = async (url: string): Promise<ProductInfo | null> => {
  try {
    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    // Dynamically parse product information
    
    const name = $("h1").text().trim();
    const style = $('li:contains("Cargo style")').text().trim() || "Unknown";
    const fit = $('li:contains("Regular fit")').text().trim() || "Unknown";
    const material = $('li:contains("100% Cotton")').text().trim() || "Unknown";
    const about = $('li:contains("about this item)').text().trim() || "Unknown";
    const description = $('li:contains("description")').text().trim() || "Unknown";
    const fitTips = $('li:contains("fit tips")').text().trim() || "Unknown";
    const careInstructions =
      $('li:contains("Machine wash according to instructions on care labels")')
        .text()
        .trim() || "Unknown";

    const productInfo: ProductInfo = {
      about,
      description,
      fitTips,
      name,
      style,
      fit,
      material,
      careInstructions,
    };

    return productInfo;
  } catch (error) {
    console.error(`Request failed: ${error}`);
    return null;
  }
};

// Call the function and log the product info
// export const productOuputParse = fetchProductInfo(url).then((info) => {
//   if (info) {
//     console.log(info);
//   }
// });

// export const fetchAndParseWebpage = async (url: string) => {
//   const productInfo = await fetchProductInfo(url); // Call the function directly
  // try {
  //   const headers = {
  //     "User-Agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  //   };

  //   const response = await axios.get(url, { headers });

  //   const html = response.data;
  //   const $ = cheerio.load(html);

  //   // Extract text from the HTML content
  //   const textContent = $.text();
  //   console.log(textContent);
  // } catch (error) {
  //   console.error("Request failed:", error);
  // }
// };

// const data = await fetchAndParseWebpage(
//   "https://www.asos.com/us/asos-design/asos-design-cargo-shorts-in-brown/prd/205855460"
// );

// console.log(data);


