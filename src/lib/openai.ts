import axios from "axios";
import { log } from "~/src/utils/config";
import { retryWithBackoff } from "~/src/utils/retryWithBackoff";

const API_KEY =
  "REMOVED_OPENAI_KEY";

const openAI = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const fetchTags = async (text: any, ask: number) => {
  log.warn("WORKING ON TEXT", text, JSON.stringify(text));
  if (ask === 1) {
    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a fashion assistant that extracts relevant fashion tags from JSON product descriptions.",
          },
          {
            role: "user",
            content: `Given the following product page JSON \n\n${JSON.stringify(
              text
            )}\n\nPlease extract the following tags: 
          - name of item
          - color 
          - material 
          - occasion 
          - brand name 
          - style 
          - pattern 
          - price 
          - category. 
          Return the output strictly in JSON format. If the input is invalid or undefined, return null.`,
          },
        ],
        max_tokens: 900,
      });
      log.warn("RESPONSE", response.data);
      const extractedTags = response.data.choices[0].message.content.trim();
      return JSON.parse(extractedTags);
      
    } catch (error) {
      log.error("Error generating OpenAI One tags:", error);
      
      throw error;
      
      
    } 
  } else if (ask === 0) {
    log.info("Generating tags with OpenAI (TagsTwo)");
    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a fashion assistant that extracts relevant fashion tags from a large unorganized product page text body.",
          },
          {
            role: "user",
            content: `Given the following extract html product page and link info text  \n\n${JSON.stringify(text)}\n\nPlease extract the following tags: 
          - color 
          - name of item
          - material 
          - occasion 
          - brand name 
          - style 
          - pattern 
          - price 
          - category. 
          Return the output strictly in JSON format. If the input is invalid or undefined, return null.`,
          },
        ],
        max_tokens: 300,
      });

      const extractedTags = response.data.choices[0].message.content.trim();
      return JSON.parse(extractedTags);
    } catch (error) {
      log.error("Error generating OpenAI Two tags:", error);
      throw error;
    }
  }
};

export const generateTags = async (text: any): Promise<any | null> => {
  log.info("Generating tags with OpenAI");
  try {
    const tags = await retryWithBackoff(
      () => fetchTags(text, 1),
      () => log.info("Retrying fetchTags..."),
      2 // Maximum number of retries
    );
    return tags;
  } catch (error) {
    log.error("Error generating OpenAI One tags:", error);
   return null;
  }
};

export const generateTagsTwo = async (text: any): Promise<any | null> => {
  try {
    const tags = await retryWithBackoff(
      () => fetchTags(text, 0),
      () => log.info("Retrying fetchTags..."),
      2 // Maximum number of retries
    );
    return tags;
  } catch (error) {
    log.error("Error generating OpenAI Two tags:", error);
    return null;
  }
};
