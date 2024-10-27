export const fetchGoogleLensResults = async (secure_url: string) => {
  const apiKey = process.env.SERPAPI_KEY;
  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_lens&url=${secure_url}&api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const results = await response.json();
  ////console.log(results);
  return results;
};
