// const { Configuration, OpenAIApi } = require("openai");

// // Your OpenAI API key



// // Example scraped description
// // const scrapedText = `
// // WearLink Men's Cargo Shorts 6 Pockets Cotton Shorts Work Casual Hiking Shorts. MATERIAL: 100% cotton; soft, durable and comfortable. Machine Wash. 
// // EXQUISITE CRAFTSMANSHIP: Relaxed loose fit cargo short with well made and trend design. 
// // Perfect details for high-end metal snap buttons, pure copper zipper closure fly, belt loops design for waist adjustment, practical and deep multi-pockets and suitable for any type of leg. 
// // COMFORT: Rests at Natural Waistline for Maximum Comfort, Relaxed Fit Will Keep You Comfortable All Day. 
// // GREAT FOR: Hiking, Work Wear, Fishing, Camping, Climbing, Casual Wear, Outdoor Sports.
// // `;

// // Function to generate tags using OpenAI API

// module.exports = async function generateTags(text) {
    
  
//     try {
//       const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: `Extract relevant fashion tags from the following description:\n\n${text}\n\nTags:`,
//         max_tokens: 50,
//         temperature: 0.7,
//       });
  
//       const tags = response.data.choices[0].text.trim();
//       console.log("Generated Tags:", tags);
//     } catch (error) {
//       console.error("Error generating tags:", error);
//     }
//   };


// OpenAIService.js
import axios from 'axios';

const API_KEY = 'REMOVED_OPENAI_KEY';

const openAI = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
  });
  
  export const generateTags = async (text) => {
    try {
        const response = await openAI.post('/chat/completions', {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a fashion assistant that extracts relevant fashion tags from JSON product descriptions.',
            },
            {
              role: 'user',
              content: `Given the following product JSON:\n\n${JSON.stringify(text)}\n\nPlease extract the following tags: 
              - color 
              - material 
              - occasion 
              - brand name 
              - style 
              - pattern 
              - price 
              - category. 
              
    
              Return the output in a JSON format with these keys.`,
            }
          ],
          max_tokens: 300,
        });
    
        const extractedTags = response.data.choices[0].message.content.trim();
        console.log('Extracted Tags:', extractedTags);
        return JSON.parse(extractedTags);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('API Error Response:', error.response.data);
          } else if (error.request) {
            console.error('API No Response:', error.request);
          } else {
            console.error('API Request Error:', error.message);
          }
        } else {
          console.error('Unexpected Error:', error);
        }
        throw error;
      }
  };

