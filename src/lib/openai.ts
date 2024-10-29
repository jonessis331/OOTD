import axios from "axios";
import { log, logIncomingData } from "~/src/utils/config";
import { retryWithBackoff } from "~/src/utils/retryWithBackoff";

const API_KEY = process.env.OPENAI_API_KEY;

const openAI = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

const fetchTags = async (text: any, ask: number) => {
  //log.warn("WORKING ON TEXT", text, JSON.stringify(text));
  if (ask === 1) {
    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4-0613", // Use a model that supports the 'functions' feature
        messages: [
          {
            role: "system",
            content:
              "You are a fashion assistant that extracts relevant fashion tags from JSON product descriptions.",
          },
          {
            role: "user",
            content: `Given the following product page JSON:

${JSON.stringify(text)}

Please extract the following tags:
- name_of_item
- color
- material
- occasion
- brand_name
- style
- pattern
- price
- category

If a tag is not available, set its value to null. If the input is invalid or undefined, return null.`,
          },
        ],
        functions: [
          {
            name: "set_tags",
            description: "Set the extracted tags",
            parameters: {
              type: "object",
              properties: {
                name_of_item: { type: "string", nullable: true },
                color: { type: "string", nullable: true },
                material: { type: "string", nullable: true },
                occasion: { type: "string", nullable: true },
                brand_name: { type: "string", nullable: true },
                style: { type: "string", nullable: true },
                pattern: { type: "string", nullable: true },
                price: { type: "string", nullable: true },
                category: { type: "string", nullable: true },
              },
              required: [], // No required fields
            },
          },
        ],
        function_call: { name: "set_tags" },
        max_tokens: 900,
      });

      const functionCall = response.data.choices[0].message.function_call;
      const extractedTags = JSON.parse(functionCall.arguments);

      return extractedTags;
    } catch (error) {
      log.error("Error generating OpenAI One tags:", error);
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
