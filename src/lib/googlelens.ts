
// export const fetchGoogleLensResults = async (secure_url: string) => {
//     const { getJson } = require("serpapi");
//     const { util } = require("util");

//     getJson({
//         api_key: "f75c3984369a0ceaec871ce180f834a4e191ca18cd6f2b08ca502fd0ee0743bc",
//         engine: "google_lens",
//         url: secure_url,
//     }, (results: any) => {
//         console.log(util.inspect(results, { colors: true, depth: null }));
//     });
// }

export const fetchGoogleLensResults = async (secure_url: string) => {
    const apiKey = "f75c3984369a0ceaec871ce180f834a4e191ca18cd6f2b08ca502fd0ee0743bc"; // Replace with your actual API key
    const response = await fetch(`https://serpapi.com/search.json?engine=google_lens&url=${secure_url}&api_key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const results = await response.json();
    //console.log(results);
    return results;
  };